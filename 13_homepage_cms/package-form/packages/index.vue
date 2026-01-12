<template>
  <form-builder
    product_name="bundle"
    v-if="payload"
    @submit="submit"
    :key="update_key"
    :node_id="node.id"
    :design="design"
    :fields="
      design === EXPEDIA_PACKAGE_FORM_DESIGN
        ? meta_expedia.fields
        : design === HOLIDAYS_PACKAGE_FORM_DESIGN
        ? meta_holidays.fields
        : meta.fields
    "
  />
</template>
<script setup>
import { computed, defineEmits, onMounted, ref, nextTick } from 'vue'
import { EXPEDIA_PACKAGE_FORM_DESIGN, HOLIDAYS_PACKAGE_FORM_DESIGN } from 'src/constants'
import keyBy from 'lodash.keyby'
import clone_deep from 'lodash.clonedeep'
import { storeToRefs } from 'pinia'
import { stores } from 'src/stores'
import dayjs from 'dayjs'

import FormBuilder from 'src/components/common/form-builder'
import { get_meta_default } from './meta_default'
import { get_meta_expedia } from './meta_expedia'
import { get_meta_holidays } from './meta_holidays'
import { check_currency_based_departure } from 'src/composables/utils/package-form'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  bundle: { type: Object, required: true },
  product: { type: Object, required: true },
  styles: { type: Object },
  color: { type: String },
  flight_campaign: { type: String },
  partner_id: { type: String },
  default_destination: { type: Object },
  design: { type: String },
  node: { type: Object },
  setting: { type: Object },
  place_types: { type: Array, default: () => [] }
})

const context_store = stores.use_context()
const package_store = stores.use_package()
const payload = computed(() => package_store.payload[props.node?.id]?.['bundle'])
const { date_format } = storeToRefs(context_store)

const traveler_limits = keyBy(props.bundle.traveler_limits, 'traveler_type')
const emit = defineEmits(['submit'])
const update_key = ref(0)
const $q = useQuasar()
const { t } = useI18n()


onMounted(async () => {
  if (props.default_destination && payload.value) {
    payload.value.ar_airport = props.default_destination
  }
  const default_values = props.setting?.default_values ?? {}
  if (default_values?.dp_airport || default_values?.dp_airport === null) {
    payload.value.dp_airport = default_values.dp_airport
  }
  if (default_values?.ar_airport || default_values?.ar_airport === null) {
    payload.value.ar_airport = default_values.ar_airport
  }
  if (default_values?.flight_dates) {
    if (
      payload.value?.flight_dates?.[0] &&
      payload.value?.flight_dates?.[1] &&
      typeof payload?.value?.flight_dates !== 'string'
    ) {
      payload.value.flight_dates[0] = default_values.flight_dates[0]
      payload.value.flight_dates[1] = default_values.flight_dates[1]
      await nextTick()
      payload.value.flight_dates = clone_deep(default_values.flight_dates)
    } else {
      payload.value.flight_dates = clone_deep(default_values.flight_dates)
    }
    await nextTick()
  }
  if (default_values?.travelers) {
    payload.value.travelers = default_values.travelers
  }
  if (default_values?.cabin_class) {
    payload.value.cabin_class = default_values.cabin_class
  }
  if (default_values?.stars) {
    payload.value.stars = default_values.stars
  }
  if (payload.value.form_data && default_values?.form_data?.separate !== undefined) {
    payload.value.form_data.separate = default_values?.form_data?.separate
    await nextTick()
  }
  if (default_values?.hotel_dates) {
    if (
      payload?.value?.hotel_dates?.[0] &&
      payload?.value?.hotel_dates?.[1] &&
      typeof payload?.value?.hotel_dates !== 'string'
    ) {
      payload.value.hotel_dates[0] = default_values.hotel_dates[0]
      payload.value.hotel_dates[1] = default_values.hotel_dates[1]
    } else {
      payload.value.hotel_dates = clone_deep(default_values.hotel_dates)
    }
    await nextTick()
  }
  await nextTick()
  update_key.value += 1
})

const rules = {
  dates: [(val) => !!val || ''],
  flight_dates: [(val) => !!val || '', (val) => validate_max_date_range(val)],
  dp_airport: [(val) => !!val || '', (v) => validate_duplicate_airport(v, 'dp_airport') || ''],
  ar_airport: [(val) => !!val || '', (v) => validate_duplicate_airport(v, 'ar_airport') || ''],
  cabin_class: [(val) => !!val || ''],
  travelers: []
}

const validate_max_date_range = (val) => {
  const max_days_range = props.bundle.date_range_limit
  if (!max_days_range) return true
  const start_date = dayjs(payload.value.flight_dates[0])
  const end_date = dayjs(payload.value.flight_dates[1])
  const diff_in_days = end_date.diff(start_date, 'day')
  if (diff_in_days > max_days_range) {
    if (typeof val === 'string') {
      const [day, month, year] = val.split('/')
      if (`${year}-${month}-${day}` === payload.value.flight_dates[1]) {
        $q.notify({
          message: t('common.range-selection-max', { max_days_range }),
          type: 'negative'
        })
      }
    } else {
      $q.notify({
        message: t('common.range-selection-max', { max_days_range }),
        type: 'negative'
      })
    }
    return false
  }
  return true
}

const validate_duplicate_airport = (value, type) => {
  if (type === 'ar_airport') {
    return value.id !== payload.value?.dp_airport?.id
  }
  if (type === 'dp_airport') {
    return value.id !== payload.value?.ar_airport?.id
  }
}

const handle_swap_airport = () => {
  const origin = clone_deep(payload.value.dp_airport)
  const destination = clone_deep(payload.value.ar_airport)
  payload.value.ar_airport = origin
  payload.value.dp_airport = destination
}

const buildExpectCodeAndType = (data) => {
  const { type, code, id } = data || {}
  let resultCode, resultType
  if (type === 'airport') {
    resultCode = code
    resultType = 'airport_code'
  } else if (
    ['city', 'multi_city_vicinity', 'province_state', 'administrative_area_level_4'].includes(type)
  ) {
    resultCode = code
    resultType = 'city_code'
  } else {
    resultCode = id
    resultType = 'place_id'
  }
  return [resultCode, resultType]
}

const validate_airport = (place, type) => {
  const dp_airport_id = payload.value.dp_airport?.id ?? ''
  const ar_airport_id = payload.value.ar_airport?.id ?? ''
  if (type === 'dp_airport' && ar_airport_id === place.id) {
    return false
  }
  if (type === 'ar_airport' && dp_airport_id === place.id) {
    return false
  }
  return true
}

const handle_currency_based_departure = async (data, dp_airport_code) => {
  const currency_code = await check_currency_based_departure(dp_airport_code, context_store)
  if (currency_code) {
    data.currency_code = currency_code
    data.disabled_currency = true
  }

  return data
}

const meta_expedia = get_meta_expedia({
  props,
  rules,
  place_types: props.place_types,
  traveler_limits,
  payload,
  date_format: date_format.value,
  handle_swap_airport,
  validate_airport,
  hide_separate_dates: props.node.meta.hide_separate_dates
})

const meta = get_meta_default({
  props,
  rules,
  traveler_limits,
  payload,
  date_format: date_format.value,
  validate_airport,
  hide_separate_dates: props.node.meta.hide_separate_dates
})

const meta_holidays = get_meta_holidays({
  props,
  rules,
  traveler_limits,
  payload,
  date_format: date_format.value,
  validate_airport,
  handle_swap_airport,
  hide_separate_dates: props.node.meta.hide_separate_dates
})

const get_expected_ar_airport = (ar_airport) => {
  if (ar_airport.type === 'hotel') {
    return ar_airport.nearest_airports[0]
  }
  return ar_airport
}

const submit = async () => {
  await nextTick()
  const {
    travelers,
    cabin_class,
    flight_dates,
    dp_airport,
    ar_airport,
    hotel_dates,
    stars,
    form_data
  } = payload.value || {}

  // let process = 'bundle'

  // if (props.bundle.bundled) {
  //   process = 'bundle'
  // }

  let [start_place_code, start_place_type] = buildExpectCodeAndType(dp_airport),
    [des_code, des_type] = buildExpectCodeAndType(get_expected_ar_airport(ar_airport))

  let should_apply_ht_date =  false 

  if (!props.node.meta.hide_separate_dates) {
    should_apply_ht_date = form_data?.separate
  } else {
    should_apply_ht_date = false
  }  

  const expectation = {
    fl_cabin_class: cabin_class,
    fl_departure_date: flight_dates[0],
    fl_return_date: flight_dates[1],
    fl_round_trip: true,
    start_place_code,
    start_place_type,
    des_code: des_code,
    des_type,
    ht_des_code: ar_airport.type === 'airport' ? ar_airport.code : ar_airport.id,
    ht_des_type:
      ar_airport.type === 'hotel'
        ? 'property_id'
        : ar_airport.type === 'airport'
        ? 'airport_code'
        : 'place_id',
    ht_checkin_date: should_apply_ht_date ? ( hotel_dates[0] || flight_dates[0] ) : flight_dates?.[0],
    ht_checkout_date:should_apply_ht_date ? ( hotel_dates[1] || flight_dates[1] ) : flight_dates?.[1],
    is_separate: form_data.separate,
    stars: stars
  }

  let data = {
    process: 'bundle',
    place_type: ar_airport.type,
    place_id: ar_airport.id,
    currency_code: context_store.currency?.code,
    language_code: context_store.language?.code,
    package_id: props.bundle.id,
    travelers: JSON.stringify(travelers),
    is_separate: form_data.separate,
    expectation: JSON.stringify(expectation)
  }

  if (props.flight_campaign) {
    data.flight_campaign = props.flight_campaign
  }
  if (props.partner_id) {
    data.partner_id = props.flight_campaign
  }
  package_store.add_selected({
    data,
    key: `bundle-${expectation.start_place_code}-${expectation.des_code}`,
    created_at: new Date().getTime(),
    payload: {
      dates: flight_dates.map((x) => dayjs(x).format('ddd, MMM DD')).join(' - '),
      min_date: flight_dates[0],
      from: dp_airport.name,
      to: ar_airport.name,
      travelers: travelers.length
    }
  })

  data = await handle_currency_based_departure(data, expectation.start_place_code)
  emit('submit', data)
}
</script>
