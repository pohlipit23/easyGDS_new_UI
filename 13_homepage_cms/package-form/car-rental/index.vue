<template>
  <form-builder
    v-if="payload"
    :key="update_key"
    :fields="meta.fields"
    :node_id="node.id"
    :style="{ '--q-primary': color }"
    product_name="car"
    @submit="submit"
  />
</template>
<script setup>
import { computed, defineEmits, defineProps, onMounted, ref, watch } from 'vue'
import dayjs from 'dayjs'

import { stores } from 'src/stores'

import FormBuilder from 'src/components/common/form-builder'
import { get_meta_default } from './meta_default'
import { formatDate, isSameDate, isTimeAfter } from 'src/composables/utils'

const emit = defineEmits(['submit'])
const props = defineProps({
  car_rental: { type: Object, required: true },
  styles: { type: Object },
  color: { type: String },
  flight_campaign: { type: String },
  partner_id: { type: String },
  default_destination: { type: Object },
  node: { type: Object },
  setting: { type: Object },
  place_types: { type: Array, default: () => [] }
})

const formatYearMonth = (date) => formatDate(date, 'YYYY/MM')

const context_store = stores.use_context()
const package_store = stores.use_package()
const payload = computed(() => package_store.payload[props.node?.id]?.['car'])
const update_key = ref(0)
const dropoff_date_default_year_month = ref(
  payload.value?.pickup_date
    ? formatYearMonth(payload.value?.pickup_date)
    : undefined
)

onMounted(() => {
  if (props.default_destination && payload.value) {
    payload.value.pickup_location = props.default_destination
  }
  const default_values = props.setting?.default_values ?? {}

  if (default_values?.driver_age) {
    payload.value.driver_age = default_values.driver_age
  }
  if (default_values?.pickup_location) {
    payload.value.pickup_location = default_values.pickup_location
  }
  if (default_values?.pickup_date) {
    payload.value.pickup_date = default_values.pickup_date
  }
  if (default_values?.pickup_time) {
    payload.value.pickup_time = default_values.pickup_time
  }
  if (
    default_values?.dropoff_data?.dropoff_location ||
    default_values?.dropoff_data?.dropoff_location === null
  ) {
    payload.value.dropoff_data = default_values.dropoff_data
  }
  if (default_values?.diff_dropoff !== undefined) {
    payload.value.diff_dropoff = default_values.diff_dropoff
  }
  if (default_values?.dropoff_date) {
    payload.value.dropoff_date = default_values.dropoff_date
  }
  if (default_values?.dropoff_time) {
    payload.value.dropoff_time = default_values.dropoff_time
  }
  update_key.value += 1
})

watch(
  () => payload.value.pickup_date,
  (pickup_date) => {
    dropoff_date_default_year_month.value = formatYearMonth(pickup_date)
    update_key.value += 1
  }
)

const rules = {
  dates: [(val) => !!val || 'Required'],
  place: [(val) => !!val || 'Required'],
  dropoff_time: [
    (val) => !!val || 'Required',
    (val) => validate_dropoff_time(val) || ''
  ],
  travelers: []
}
const validate_dropoff_date = (date) => {
  let min_date = new Date()
  if (payload.value?.pickup_date) {
    min_date = new Date(payload.value.pickup_date)
  }
  return (
    dayjs(new Date(date)).isAfter(min_date) ||
    isSameDate(new Date(date), min_date)
  )
}

const validate_dropoff_time = (time) => {
  if (payload.value?.pickup_date === payload.value?.dropoff_date) {
    if (!payload.value?.pickup_time) return true
    return isTimeAfter(time, payload.value?.pickup_time)
  }
  return true
}

const meta = get_meta_default({
  props,
  rules,
  payload,
  place_types: props.place_types,
  validate_dropoff_date,
  dropoff_date_default_year_month: dropoff_date_default_year_month.value
})

const submit = () => {
  const {
    driver_age,
    diff_dropoff,
    pickup_location,
    pickup_date,
    pickup_time,
    dropoff_data,
    dropoff_date,
    dropoff_time
  } = payload.value || {}

  const expectation = {
    cr_driver_age: driver_age,
    cr_diff_dropoff_location: diff_dropoff,
    cr_pickup_place_code:
      pickup_location.type === 'airport' ? pickup_location.code : null,
    cr_pickup_date: pickup_date,
    cr_pickup_time: pickup_time,
    cr_pickup_place_type: 'airport_code',
    cr_dropoff_place_code: dropoff_data.dropoff_location?.code,
    cr_dropoff_date: dropoff_date,
    cr_dropoff_time: dropoff_time,
    cr_dropoff_place_type: 'airport_code',
    is_separate: false
  }

  const data = {
    process: 'car_rental',
    currency_code: context_store.currency?.code,
    language_code: context_store.language?.code,
    package_id: props.car_rental.id,
    travelers: JSON.stringify([]),
    expectation: JSON.stringify(expectation),
    flight_campaign: props.flight_campaign,
    partner_id: props.partner_id
  }
  package_store.add_selected({
    data,
    key: `car_rental-${expectation.cr_pickup_place_code}`,
    created_at: new Date().getTime(),
    payload: {
      from: pickup_location.name,
      dates: `${dayjs(pickup_date).format('ddd, MMM DD')} - ${dayjs(
        dropoff_date
      ).format('ddd, MMM DD')}`,
      age: driver_age,
      min_date: pickup_date
    }
  })
  emit('submit', data)
}
</script>
