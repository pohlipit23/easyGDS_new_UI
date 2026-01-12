<template>
  <q-btn class="full-width"
         :disable="disabled"
         unelevated
         text-color="white"
         :size="design === HOLIDAYS_PACKAGE_FORM_DESIGN ? 'lg' : 'md'"
         :loading="in_progress"
         type="submit"
         :style="styles">
    <span :style="label_styles">
      {{label}}
    </span>
  </q-btn>
</template>
<script setup>

import {defineProps, computed} from 'vue'
import { HOLIDAYS_PACKAGE_FORM_DESIGN } from 'src/constants'

const props = defineProps({
  disabled: {type: Boolean, default: false},
  height: {type: Number, default: 40},
  color: {type: String, default: '#1976d2'},
  label: {type: String, default: 'components.shopping.forms.common.search-btn.label'},
  in_progress: {type: Boolean},
  design: {type: String, default: ''}
})

const styles = computed(() => {
  let result = {
    'height': `${props.height}px`,
    'background-color': props.color
  }
  if (props.design === HOLIDAYS_PACKAGE_FORM_DESIGN) {
    result['border-radius'] = '2.5rem'
    // result['font-size'] = '16px'

  }
  return result
})

const label_styles = computed(() => {
  let result = {}
  if (props.design === HOLIDAYS_PACKAGE_FORM_DESIGN) {
    result['font-size'] = '16px'
    result['text-transform'] = 'capitalize'
  }
  return result
})
</script>
