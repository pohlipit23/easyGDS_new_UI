<template>
  <div class="egs-add-flight-field">
    <q-btn
      color="primary"
      dense
      flat
      icon="add"
      outline
      size="sm"
      @click="$emit('add_flight')"
      :disable="disabled"
    >
      Add another flight
    </q-btn>
  </div>
</template>
<script setup>
const props = defineProps({
  modelValue: { type: Object },
  disabled: { type: Boolean, default: false }
})
</script>
