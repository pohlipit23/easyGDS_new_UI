<template>
  <place-select
    v-if="modelValue"
    dense
    v-model="form_data.dropoff_location"
    :types="place_types"
    :rules="rules.place"
    outlined
    hide-bottom-space
    fill-input
    hide-selected
    :label="$t('common.dropoff-location')"
    ref="place_select"
    @done="emit('done')"
  >
    <template v-slot:prepend>
      <q-icon class="cursor-pointer" @click="toggle" name="check_box" />
    </template>
  </place-select>
  <q-field ref="check_box" outlined v-else dense color="black">
    <template v-slot:control>
      <span
        class="cursor-pointer"
        dom-key="car-rental.different-dropoff"
        @click="toggle"
      >
        {{ $t('common.different-dropoff-location') }}
      </span>
    </template>
    <template v-slot:prepend>
      <q-icon
        class="cursor-pointer"
        @click="toggle"
        name="check_box_outline_blank"
      />
    </template>
  </q-field>
</template>
<script setup>
import PlaceSelect from 'src/components/common/place-select/index.vue'

import { defineProps, defineEmits, watch, ref } from 'vue'

const emit = defineEmits(['update:modelValue', 'done'])

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  form_data: { type: Object, required: true },
  place_types: { type: Array, default: () => [] }
})

const rules = [(v) => !!v || '']

const check_box = ref(null)
const place_select = ref(null)

watch(
  () => props.modelValue,
  (val) => {
    if (!val) props.form_data.dropoff_location = null
  }
)

const toggle = () => {
  emit('update:modelValue', !props.modelValue)
  if (props.modelValue) {
    props.form_data.dropoff_location = null
  }
}

const open_dialog = () => {
  if (props.modelValue) {
    place_select.value.open_dialog()
  } else {
    check_box.value.focus()
  }
}
defineExpose({
  open_dialog
})
</script>
