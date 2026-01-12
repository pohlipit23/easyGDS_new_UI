<template>
  <form-builder
    v-if="payload"
    :fields="meta.fields"
    :node_id="node.id"
    :key="update_key"
    :style="{ '--q-primary': color }"
    product_name="transfer"
    @submit="submit"
  />
</template>
<script setup>
import { computed, defineEmits, onMounted, ref } from 'vue'
import keyBy from 'lodash.keyby'
import dayjs from 'dayjs'

import { stores } from 'src/stores'
import { get_meta_default } from './meta_default'

import FormBuilder from 'src/components/common/form-builder'

const props = defineProps({
  product: { type: Object, required: true },
  transfer: { type: Object, required: true },
  styles: { type: Object },
  color: { type: String },
  flight_campaign: { type: String },
  partner_id: { type: String },
  default_destination: { type: Object },
  node: { type: Object },
  setting: { type: Object },
  place_types: { type: Array, default: () => [] }
})

const context_store = stores.use_context()
const package_store = stores.use_package()
const payload = computed(
  () => package_store.payload[props.node?.id]?.['transfer']
)

const emit = defineEmits(['submit'])

const traveler_limits = keyBy(props.transfer.traveler_limits, 'traveler_type')
const update_key = ref(0)

onMounted(() => {
  if (props.default_destination && payload.value) {
    payload.value.ar_airport = props.default_destination
  }

  const default_values = props.setting?.default_values ?? {}

  if (default_values?.airport || default_values?.airport === null) {
    payload.value.airport = default_values.airport
  }

  if (default_values?.destination || default_values?.destination === null) {
    payload.value.destination = default_values.destination
  }

  if (default_values?.from_airport !== undefined) {
    payload.value.from_airport = default_values.from_airport
  }

  if (default_values?.round_trip !== undefined) {
    payload.value.round_trip = default_values.round_trip
  }

  if (default_values?.pickup_date) {
    payload.value.pickup_date = default_values.pickup_date
  }

  if (default_values?.pickup_time) {
    payload.value.pickup_time = default_values.pickup_time
  }

  if (default_values?.return_date) {
    payload.value.return_date = default_values.return_date
  }

  if (default_values?.return_time) {
    payload.value.return_time = default_values.return_time
  }

  if (default_values?.travelers) {
    payload.value.travelers = default_values.travelers
  }
  update_key.value += 1
})

const rules = {
  dates: [(val) => !!val || 'Required'],
  place: [(val) => !!val || 'Required'],
  travelers: []
}

const meta = get_meta_default({
  props,
  rules,
  payload,
  traveler_limits
})

const submit = () => {
  const {
    pickup_date,
    pickup_time,
    travelers,
    from_airport,
    round_trip,
    return_date,
    return_time,
    airport,
    destination
  } = payload.value || {}

  const expectation = {
    is_separate: false,
    tf_airport_code: airport.code,
    tf_from_airport: from_airport,
    tf_pickup_date: pickup_date,
    tf_pickup_time: pickup_time,
    tf_place_code: destination.id,
    tf_place_type:
      destination.type === 'hotel'
        ? 'property_id'
        : destination.type === 'airport'
        ? 'airport_code'
        : 'place_id',
    tf_return_date: round_trip ? return_date : null,
    tf_return_time: round_trip ? return_time : null,
    tf_round_trip: false
  }

  const data = {
    process: 'transfer',
    currency_code: context_store.currency?.code,
    language_code: context_store.language?.code,
    package_id: props.transfer.id,
    travelers: JSON.stringify(travelers),
    expectation: JSON.stringify(expectation),
    flight_campaign: props.flight_campaign,
    partner_id: props.partner_id
  }
  package_store.add_selected({
    data,
    key: `transfer-${expectation.tf_airport_code}-${expectation.tf_place_code}`,
    created_at: new Date().getTime(),
    payload: {
      from: airport.name,
      to: destination.name,
      dates: `${dayjs(pickup_date).format('ddd, MMM DD')}`,
      travelers: travelers.length,
      min_date: pickup_date
    }
  })
  emit('submit', data)
}
</script>
