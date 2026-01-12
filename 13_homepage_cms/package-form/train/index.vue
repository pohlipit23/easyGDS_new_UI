<template>
  <form-builder
    v-if="payload"
    :key="update_key"
    :fields="meta.fields"
    :node_id="node.id"
    :style="{ '--q-primary': color }"
    product_name="train"
    @submit="submit"
  />
</template>
<script setup>
import { computed, defineEmits, onMounted, ref } from 'vue'
import clone_deep from 'lodash.clonedeep'
import key_by from 'lodash.keyby'
import dayjs from 'dayjs'

import { stores } from 'src/stores'
import { get_meta_default } from './meta_default'

import FormBuilder from 'src/components/common/form-builder'

const props = defineProps({
  flight: { type: Object, required: true },
  product: { type: Object, required: true },
  styles: { type: Object },
  color: { type: String, default: '#1976d2' },
  flight_campaign: { type: String },
  partner_id: { type: String },
  default_destination: { type: Object },
  design: { type: String },
  node: { type: Object },
  setting: { type: Object }
})

const context_store = stores.use_context()
const package_store = stores.use_package()
const payload = computed(() => package_store.payload[props.node?.id]?.['train'])
const booking_settings = computed(() => context_store.app?.booking_settings)

const update_key = ref(0)

onMounted(async () => {
  if (payload.value && props.default_destination) {
    payload.value.ar_airport = props.default_destination
  }
})

const traveler_limits = key_by(props.flight.traveler_limits, 'traveler_type')
const place_types = ['railway_station']

const emit = defineEmits(['submit'])

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
  const origin = clone_deep(payload.value.dp_airport)
  const destination = clone_deep(payload.value.ar_airport)
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

const handle_change_group_booking = (data) => {  
  payload.value.group_booking = data ? true : false
  payload.value.group_booking_travelers = data ? data : [{type: "adult", child: 0, infant: 0, adult: 11}]
}

const meta = get_meta_default({
  props,
  rules,
  payload,
  place_types,
  traveler_limits,
  handle_swap_airport,
  handle_validate_place,
  group_booking_travelers: payload.value.group_booking_travelers,
  group_booking: payload.value.group_booking,
  handle_change_group_booking,
  is_show_group_booking_toggle:
    booking_settings.value?.group_booking &&
    booking_settings.value?.group_booking_products?.includes('train')
})

const submit = () => {
  const {
    travelers,
    ar_airport,
    dp_airport,
    dates,
    group_booking,
    tn_round_trip,
    group_booking_travelers
  } = payload.value || {}

  const expectation = {
    tn_departure_code: dp_airport.code,
    tn_departure_type: dp_airport.type,
    tn_arrival_code: ar_airport.code, 
    tn_arrival_type: ar_airport.type,
    tn_return_date: tn_round_trip ? dates[1] : null,
    tn_departure_date: tn_round_trip ? dates[0] : dates,
    tn_round_trip: Boolean(tn_round_trip),
    group_booking: Boolean(group_booking),
    adults: group_booking_travelers?.adult || group_booking_travelers?.[0]?.adult || 11,
    children: group_booking_travelers?.child || group_booking_travelers?.[0]?.child || 0,
    infants: group_booking_travelers?.infant || group_booking_travelers?.[0]?.infant || 0
  }

  const data = {
    process: 'train',
    product_code: 'train',
    type: 'railway_station',
    currency_code: context_store.currency?.code,
    language_code: context_store.language?.code,
    package_id: props.flight.id,
    travelers: JSON.stringify(travelers),
    group_booking: Boolean(group_booking),
    expectation: JSON.stringify(expectation)
  }

  package_store.add_selected({
    data,
    key: `train-${data.type ?? 'train_hotel'}-${
      expectation.tn_departure_code
    }-${expectation.tn_arrival_code}`,
    created_at: new Date().getTime(),
    payload: {
      dates: typeof dates === 'string' ? dayjs(dates).format('ddd, MMM DD') : `${dayjs(dates[0]).format('ddd, MMM DD')} - ${dayjs(dates[1]).format('ddd, MMM DD')}`,
      travelers: travelers.length,
      from: dp_airport.name,
      to: ar_airport.name,
      type: tn_round_trip ? 'round_trip' : 'one_way',
      min_date: typeof dates === 'string' ? dates : dates[0]
    }
  })
  emit('submit', data)
}
</script>
