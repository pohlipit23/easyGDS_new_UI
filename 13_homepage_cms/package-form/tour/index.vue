<template>
  <form-builder
    v-if="payload"
    :fields="meta.fields"
    :key="update_key"
    :node_id="node.id"
    :style="{ '--q-primary': color }"
    product_name="tour"
    @submit="submit"
  />
</template>
<script setup>
import { computed, defineEmits, onMounted, ref } from 'vue'
import keyBy from 'lodash.keyby'
import dayjs from 'dayjs'
import clone_deep from 'lodash.clonedeep'

import { stores } from 'src/stores'

import FormBuilder from 'src/components/common/form-builder'
import { get_meta_default } from './meta_default'

const emit = defineEmits(['submit'])
const update_key = ref(0)

const props = defineProps({
  product: { type: Object, required: true },
  tour: { type: Object, required: true },
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
const payload = computed(() => package_store.payload[props.node?.id]?.['tour'])

onMounted(() => {
  if (props.default_destination && payload.value) {
    payload.value.place = props.default_destination
  }
  const default_values = props.setting?.default_values ?? {}

  if (default_values?.place || default_values?.place === null) {
    payload.value.place = default_values.place
  }
  if (default_values?.dates) {
    if (payload?.value?.dates?.[0] && payload?.value?.dates?.[1]) {
      payload.value.dates[0] = default_values.dates[0]
      payload.value.dates[1] = default_values.dates[1]
    } else {
      payload.value.dates = clone_deep(default_values.dates)
    }
  }
  if (default_values?.travelers) {
    payload.value.travelers = default_values.travelers
  }
  update_key.value += 1
})

const traveler_limits = keyBy(props.tour.traveler_limits, 'traveler_type')

const rules = {
  dates: [(val) => !!val || 'Required'],
  place: [(val) => !!val || 'Required'],
  travelers: []
}

const meta = get_meta_default({
  props,
  rules,
  payload,
  place_types: props.place_types,
  traveler_limits
})

const submit = () => {
  const { travelers, place, dates } = payload.value || {}
  const expectation = {
    is_separate: false,
    tr_des_code: place.type === 'airport' ? place.code : place.id,
    tr_des_type: place.type === 'airport' ? 'airport_code' : 'place_id',
    tr_start_date: dates[0],
    tr_end_date: dates[1]
  }
  const data = {
    process: 'tour',
    currency_code: context_store.currency?.code,
    language_code: context_store.language?.code,
    package_id: props.tour.id,
    travelers: JSON.stringify(travelers),
    expectation: JSON.stringify(expectation),
    flight_campaign: props.flight_campaign,
    partner_id: props.partner_id
  }
  package_store.add_selected({
    data,
    key: `tour-${expectation.tr_des_code}`,
    created_at: new Date().getTime(),
    payload: {
      dates: `${dayjs(dates[0]).format('ddd, MMM DD')} - ${dayjs(dates[1]).format('ddd, MMM DD')}`,
      travelers: travelers.length,
      from: place.name,
      min_date: dates[0]
    }
  })
  emit('submit', data)
}
</script>
