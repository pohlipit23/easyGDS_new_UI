<template>
  <form-builder
    product_name="train_hotel"
    v-if="payload"
    @submit="submit"
    :key="update_key"
    :node_id="node.id"
    :fields="meta_expedia.fields"
  />
</template>
<script setup>
import { computed, defineEmits, onMounted, ref } from 'vue'
import cloneDeep from 'lodash.clonedeep'
import dayjs from 'dayjs'
import key_by from 'lodash.keyby'

import { storeToRefs } from 'pinia'
import { stores } from 'src/stores'
import { get_default_expedia } from './default_expedia'

import FormBuilder from 'src/components/common/form-builder'

const props = defineProps({
  package: { type: Object, required: true },
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
const payload = computed(
  () => package_store.payload[props.node?.id]?.['train_hotel']
)
const { date_format } = storeToRefs(context_store)

const traveler_limits = key_by(props.package.traveler_limits, 'traveler_type')
const emit = defineEmits(['submit'])
const update_key = ref(0)

onMounted(() => {
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
  if (default_values?.train_dates) {
    if (payload?.value?.train_dates?.[0] && payload?.value?.train_dates?.[1] && typeof payload?.value?.train_dates !== 'string') {
      payload.value.train_dates[0] = default_values.train_dates[0]
      payload.value.train_dates[1] = default_values.train_dates[1]
    } else {
      payload.value.train_dates = clone_deep(default_values.train_dates)
    }
  }
  if (default_values?.travelers) {
    payload.value.travelers = default_values.travelers
  }
  if (default_values?.stars) {
    payload.value.stars = default_values.stars
  }
  if (
    payload.value.form_data &&
    default_values?.form_data?.separate !== undefined
  ) {
    payload.value.form_data.separate = default_values?.form_data?.separate
  }
  if (default_values?.hotel_dates) {
    if (payload?.value?.hotel_dates?.[0] && payload?.value?.hotel_dates?.[1] && typeof payload?.value?.hotel_dates !== 'string') {
      payload.value.hotel_dates[0] = default_values.hotel_dates[0]
      payload.value.hotel_dates[1] = default_values.hotel_dates[1]
    } else {
      payload.value.hotel_dates = clone_deep(default_values.hotel_dates)
    }
  }
  update_key.value += 1
})

const rules = {
  dp_airport: [
    (val) => !!val || '',
    (v) => validate_duplicate_airport(v, 'dp_airport') || ''
  ],
  ar_airport: [
    (val) => !!val || '',
    (v) => validate_duplicate_airport(v, 'ar_airport') || ''
  ],
  dates: [(val) => !!val || ''],
  place: [(val) => !!val || ''],
  cabin_class: [(val) => !!val || ''],
  travelers: []
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
  const origin = cloneDeep(payload.value.dp_airport)
  const destination = cloneDeep(payload.value.ar_airport)
  payload.value.ar_airport = origin
  payload.value.dp_airport = destination
}

const handle_validate_place = (type, place) => {
  const dp_airport_id = payload.value.dp_airport?.id ?? ''
  const ar_airport_id = payload.value.ar_airport?.id ?? ''
  if (type === 'origin' && ar_airport_id === place.id) {
    return false
  }
  if (type === 'destination' && dp_airport_id === place.id) {
    return false
  }
  return true
}

const meta_expedia = get_default_expedia({
  props,
  rules,
  place_types: props.place_types,
  traveler_limits,
  payload,
  date_format: date_format.value,
  handle_swap_airport,
  handle_validate_place
})

const submit = () => {
  const { dp_airport, ar_airport, train_dates, travelers, stars, hotel_dates } =
    payload.value || {}

  const ar_ancestors = key_by(ar_airport?.ancestors || [], 'type')

  const expectation = {
    tn_departure_code: dp_airport.code,
    tn_departure_type: dp_airport.type,
    tn_arrival_code: ar_airport.code,
    tn_arrival_type: ar_airport.type,
    tn_departure_date: train_dates[0],
    tn_return_date: train_dates[1],
    ht_des_code: ar_ancestors?.['administrative_area_level_4']?.id,
    ht_des_type: 'place_id',
    ht_checkin_date: hotel_dates?.[0] || train_dates[0],
    ht_checkout_date: hotel_dates?.[1] || train_dates[1],
    stars: stars
  }

  const data = {
    process: 'train',
    currency_code: context_store.currency?.code,
    language_code: context_store.language?.code,
    package_id: props.package.id,
    travelers: JSON.stringify(travelers),
    expectation: JSON.stringify(expectation)
  }
  package_store.add_selected({
    data,
    created_at: new Date().getTime(),
    key: `train-${data.type ?? 'train_hotel'}-${
      expectation.tn_departure_code
    }-${expectation.tn_arrival_code}`,
    payload: {
      dates: `${dayjs(train_dates[0]).format('ddd, MMM DD')} - ${dayjs(train_dates[1]).format('ddd, MMM DD')}`,
      travelers: travelers.length,
      rooms: Object.keys(key_by(travelers, 'room'))?.length ?? 1,
      from: dp_airport.name,
      to: ar_airport.name,
      min_date: train_dates[0]
    }
  })
  emit('submit', data)
}
</script>
