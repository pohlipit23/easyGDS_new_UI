<template>
  <form-builder
    v-if="payload"
    :key="update_key"
     :design="design"
    :fields="
      design === EXPEDIA_PACKAGE_FORM_DESIGN ? meta_expedia.fields : design === HOLIDAYS_PACKAGE_FORM_DESIGN ? meta_holidays.fields : meta.fields
    "
    :node_id="node.id"
    :style="{ '--q-primary': color }"
    product_name="hotel"
    @submit="submit"
  />
</template>
<script setup>
import { computed, defineEmits, onMounted, ref } from 'vue'
import key_by from 'lodash.keyby'
import clone_deep from 'lodash.clonedeep'
import dayjs from 'dayjs'

import { stores } from 'src/stores'
import { EXPEDIA_PACKAGE_FORM_DESIGN, HOLIDAYS_PACKAGE_FORM_DESIGN } from 'src/constants'

import FormBuilder from 'src/components/common/form-builder'
import { get_meta_default } from './meta_default'
import { get_meta_expedia } from './meta_expedia'
import { get_meta_holidays } from './meta_holidays'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['submit'])
const update_key = ref(0)
const form_builder_ref = ref(null)
const $q = useQuasar()
const { t } = useI18n()

const props = defineProps({
  product: { type: Object, required: true },
  hotel: { type: Object, required: true },
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
const payload = computed(() => package_store.payload[props.node?.id]?.['hotel'])

onMounted(() => {
  if (props.default_destination && payload.value) {
    payload.value.place = props.default_destination
  }
  const default_values = props.setting?.default_values ?? {}

  if (default_values?.place || default_values?.place === null) {
    payload.value.place = default_values.place
  }
  if (default_values?.dates) {
    if (payload?.value?.dates?.[0] && payload.value?.dates?.[1]) {
      payload.value.dates[0] = default_values.dates[0]
      payload.value.dates[1] = default_values.dates[1]
    } else {
      payload.value.dates = clone_deep(default_values.dates)
    }
  }
  if (default_values?.travelers) {
    payload.value.travelers = default_values.travelers
  }
  if (default_values?.nationality) {
    payload.value.nationality = default_values.nationality
  }
  if (default_values?.is_crew_booking !== undefined) {
    payload.value.is_crew_booking = default_values.is_crew_booking
  }
  if (default_values?.crew_booking_rooms) {
    payload.value.crew_booking_rooms = default_values.crew_booking_rooms
  }
  update_key.value += 1
})

const on_change_crew_booking = ({ is_crew_booking, crew_booking_rooms }) => {
  payload.value.is_crew_booking = is_crew_booking
  payload.value.crew_booking_rooms = crew_booking_rooms
}
const traveler_limits = key_by(props.hotel.traveler_limits, 'traveler_type')


const validate_max_date_range = (val) => {    
  const max_days_range = props.hotel.date_range_limit
  if(!max_days_range) return true
  const start_date = dayjs(payload.value.dates[0])
  const end_date = dayjs(payload.value.dates[1])
  const diff_in_days = end_date.diff(start_date, 'day')
  if(diff_in_days > max_days_range) {
    if(typeof val === 'string') {
      const [day, month, year] = val.split('/')    
      if(`${year}-${month}-${day}` === payload.value.dates[1]) {
        $q.notify({
          message: t('common.range-selection-max', {max_days_range}), 
          type: 'negative'
        })
      }      
    } else {
        $q.notify({
          message: t('common.range-selection-max', {max_days_range}), 
          type: 'negative'
        })       
    }
    return false
  }
  return true
}

const rules = {
  dates: [(val) => !!val || '', (val) => validate_max_date_range(val)],
  place: [(val) => !!val || ''],
  travelers: [],
  nationality: [(val) => {
    if(props.node.meta.nationality_required) {
      return !!val || ''
    }
    return true
  }]
}

const meta = get_meta_default({
  props,
  rules,
  payload,
  place_types: props.place_types,
  traveler_limits,
  group: context_store.group,
  form_builder_ref,
  on_change_crew_booking,
  is_crew_booking: payload.value.is_crew_booking,
  crew_booking_rooms: payload.value.crew_booking_rooms,
  show_crew_booking:
    props.setting?.show_crew_booking || props.node.meta.show_crew_booking,
  places_and_properties: props.setting?.places_and_properties,
  country_codes: context_store.country_codes
})

const meta_expedia = get_meta_expedia({
  props,
  rules,
  place_types: props.place_types,
  traveler_limits,
  group: context_store.group,
  on_change_crew_booking,
  is_crew_booking: payload.value.is_crew_booking,
  crew_booking_rooms: payload.value.crew_booking_rooms,
  places_and_properties: props.setting?.places_and_properties,
  country_codes: context_store.country_codes
})

const meta_holidays = get_meta_holidays({
  props,
  rules,
  payload,
  place_types: props.place_types,
  traveler_limits,
  group: context_store.group,
  form_builder_ref,
  on_change_crew_booking,
  is_crew_booking: payload.value.is_crew_booking,
  crew_booking_rooms: payload.value.crew_booking_rooms,
  show_crew_booking:
    props.setting?.show_crew_booking || props.node.meta.show_crew_booking,
  places_and_properties: props.setting?.places_and_properties,
  country_codes: context_store.country_codes
})

const submit = () => {
  const {
    travelers,
    place,
    dates,
    nationality,
    is_crew_booking,
    crew_booking_rooms
  } = payload.value || {}
  const expectation = {
    nationality: nationality?.code ?? (nationality || undefined),
    ht_des_code: place?.type === 'airport' ? place?.code : place?.id,
    ht_checkin_date: dates[0],
    ht_checkout_date: dates[1],
    ht_des_type:
      place?.type === 'hotel'
        ? 'property_id'
        : place?.type === 'airport'
        ? 'airport_code'
        : 'place_id',
    is_separate: false
  }

  if (!nationality?.code) {
    delete expectation.nationality
  }

  const data = {
    process: 'hotel',
    place_type: place.type,
    place_id: place.id,
    currency_code: context_store.currency?.code,
    language_code: context_store.language?.code,
    package_id: props.hotel.id,
    travelers: is_crew_booking
      ? JSON.stringify(crew_booking_rooms)
      : JSON.stringify(travelers),
    nationality: nationality?.code ?? (nationality || undefined),
    expectation: JSON.stringify(expectation),
    flight_campaign: props.flight_campaign,
    partner_id: props.partner_id,
    show_crew_booking:
      props.setting?.show_crew_booking || props.node.meta.show_crew_booking,
    is_crew_booking: is_crew_booking
  }

  if (!data.nationality) {
    delete data.nationality
  }

  if (place.type === 'hotel') {
    package_store.add_viewed({
      data,
      key: `hotel-${expectation.ht_des_code}`,
      payload: {
        name: place.name,
        dates: `${dayjs(dates[0]).format('ddd, MMM DD')} - ${dayjs(
          dates[1]
        ).format('ddd, MMM DD')}`,
        travelers: travelers.length,
        rooms: Object.keys(key_by(travelers, 'room'))?.length ?? 1,
        avatar:
          place.avatar?.urls?.md ??
          place.avatar?.urls?.sm ??
          place.avatar?.urls?.lg,
        star: place.star,
        address: place.street_address,
        nationality: nationality?.code ?? nationality,
        min_date: dates[0]
      }
    })
  } else {
    package_store.add_selected({
      data,
      key: `hotel-${expectation.ht_des_code}`,
      created_at: new Date().getTime(),
      payload: {
        min_date: dates[0],
        from: place.name,
        dates: `${dayjs(dates[0]).format('ddd, MMM DD')} - ${dayjs(
          dates[1]
        ).format('ddd, MMM DD')}`,
        travelers: travelers.length,
        rooms: Object.keys(key_by(travelers, 'room'))?.length ?? 1
      }
    })
  }
  emit('submit', data)
}
</script>
