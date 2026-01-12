<template>
  <form-builder
    v-if="payload"
    :key="update_key"
    :fields="meta.fields"
    :node_id="node.id"
    :style="{ '--q-primary': color }"
    product_name="stopover"
    @submit="submit"
  />
</template>
<script setup>
import { computed, defineEmits, onMounted, ref } from 'vue'
import keyBy from 'lodash.keyby'
import dayjs from 'dayjs'

import { stores } from 'src/stores'
import FormBuilder from 'src/components/common/form-builder'
import { get_meta_default } from './meta_default'
import { AUH } from './auh'

const emit = defineEmits(['submit'])
const update_key = ref(0)

const props = defineProps({
  product: { type: Object, required: true },
  hotel: { type: Object, required: true , default: () => {}},
  styles: { type: Object },
  color: { type: String },
  flight_campaign: { type: String },
  partner_id: { type: String },
  design: { type: String },
  node: { type: Object },
  setting: { type: Object },
  place_types: { type: Array, default: () => [] }
})
const context_store = stores.use_context()
const package_store = stores.use_package()
const payload = computed(
  () => package_store.payload[props.node?.id]?.['stopover']
)

onMounted(() => {
  const default_values = props.setting?.default_values ?? {}
  if (default_values?.dates) {
    payload.value.dates = default_values.dates
  }
  if (default_values?.travelers) {
    payload.value.travelers = default_values.travelers
  }
  payload.value.place = AUH
  update_key.value += 1
})

const traveler_limits = keyBy(props.hotel.traveler_limits, 'traveler_type')

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
    so_des_code: place.type === 'airport' ? place.code : place.id,
    so_checkin_date: dates[0],
    so_checkout_date: dates[1],
    so_des_type: place.type === 'airport' ? 'airport_code' : 'place_id',
    is_separate: false
  }
  const data = {
    process: 'stopover',
    place_type: place.type,
    place_id: place.id,
    currency_code: context_store.currency?.code,
    language_code: context_store.language?.code,
    package_id: props.hotel.id,
    travelers: JSON.stringify(travelers),
    expectation: JSON.stringify(expectation),
    flight_campaign: props.flight_campaign,
    partner_id: props.partner_id
  }
  package_store.add_selected({
    data,
    key: `stopover-${expectation.so_des_code}`,
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
