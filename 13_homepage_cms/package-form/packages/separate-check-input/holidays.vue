<template>
  <div>
    <q-checkbox
      :model-value="modelValue"
      label="I need stay only for part of my trip"
      @update:model-value="handle_change"
    />
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true, default: false },
  payload: { type: Object, required: true, default: () => [] }
})

const emit = defineEmits(['update:modelValue'])

const handle_change = (val) => {
  if (val) {
    props.payload.value.hotel_dates = [
      props.payload.value.flight_dates[0],
      props.payload.value.flight_dates[1]
    ]
  }
  emit('update:modelValue', val)
}
</script>
