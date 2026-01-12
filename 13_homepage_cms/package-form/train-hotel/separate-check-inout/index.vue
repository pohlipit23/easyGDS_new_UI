<template>
  <q-field
    outlined
    :label-slot="modelValue"
    dense color="black"
    hide-bottom-space
    :rules="rules"
    :model-value="display_value"
    :stack-label="modelValue"
    ref="separate_check_input_comp"
  >
    <template v-slot:label v-if="modelValue">
      <span dom-key="bundle.checkin">
        {{ $t('common.checkin') }}
      </span>
      {{ ` / ` }}
      <span dom-key="bundle.checkout">
        {{ $t('common.checkout') }}
      </span>
    </template>
    <template v-slot:prepend>
      <q-icon
        class="cursor-pointer"
        @click="$emit('update:modelValue', !modelValue)"
        :name="modelValue ? 'check_box': 'check_box_outline_blank'"
      />
    </template>
    <template v-if="modelValue" v-slot:control>
      <q-item-label lines="1">{{ display_value }}</q-item-label>
    </template>
    <template v-else v-slot:control>
      <q-item-label
        @click="$emit('update:modelValue', !modelValue)"
        class="cursor-pointer text-caption"
      >
        <span dom-key="bundle.separate-check-inout">
          {{ $t('common.part-of-my-stay') }}
        </span>
      </q-item-label>
    </template>
    <q-popup-proxy ref="popup_proxy" v-if="modelValue" transition-show="scale" transition-hide="scale">
      <div style="max-width: 300px">
        <q-date class="eg-date-picker hide-year-navigation"
                v-model="value_holder"
                v-bind="v_bind"
                :mask="date_format"
                :options="validate_date"
                @update:model-value="handle_date_changed"
        />
      </div>
    </q-popup-proxy>
  </q-field>
</template>
<script setup>

import {convert_string_to_date, change_datetime_format} from 'src/composables/utils'
import {defineProps, ref, watch, computed} from 'vue'

const props = defineProps({
  modelValue: {type: Boolean, required: true, default: false},
  flight_dates: {type: Array},
  hotel_dates: {type: Array, required: true},
  date_format: {type: String, default: 'YYYY-MM-DD'},
  display_format: { type: String, default: 'DD/MM/YYYY' },
  readonly: {type: Boolean},
  disabled: {type: Boolean},
})
const rules = ref([
  v => {
    if (!props.modelValue) return true
    return v !== 'Invalid date - Invalid date' || ''
  }
])

const value_holder = ref(null)
const popup_proxy = ref(null)
const separate_check_input_comp = ref(null)

const handle_date_changed = (val) => {
  props.hotel_dates[0] = val.from
  props.hotel_dates[1] = val.to
  popup_proxy.value?.hide?.()
}

const validate_date = (date) => {
  let quasar_format = 'YYYY/MM/DD'
  let departure_date = change_datetime_format(
    props.flight_dates?.[0],
    props.date_format,
    quasar_format
  )
  let return_date = change_datetime_format(
    props.flight_dates?.[1],
    props.date_format,
    quasar_format
  )
  return (departure_date <= date) && (date <= return_date)
}

const v_bind = computed(() => {
  let result = {
    minimal: true,
    range: true,
  }
  if (props.flight_dates?.[0]) {
    let departure_date = convert_string_to_date(
      props.flight_dates?.[0],
      props.date_format
    )
    result['default-year-month'] = departure_date.format('YYYY/MM')
  }

  return result
})

const display_value = computed(() => {
  let result = {
    from: change_datetime_format(
      props.hotel_dates?.[0],
      props.date_format,
      props.display_format
    ),
    to: change_datetime_format(
      props.hotel_dates?.[1],
      props.date_format,
      props.display_format
    )
  }
  return `${result.from || 'Invalid date'} - ${result.to || 'Invalid date'}`
})


watch(
  () => props.flight_dates,
  val => {
    handle_date_changed({from: val?.[0], to: val?.[1]})
  },
)

const open_dialog = () => {
  if(!props.modelValue) {
    separate_check_input_comp.value.focus()
  } else {
    popup_proxy.value.show()
  }
}

defineExpose({
  open_dialog
})
</script>
