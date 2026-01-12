<template>
  <q-field
    outlined
    :disable="disabled"
    :label-slot="modelValue"
    dense
    color="primary"
    hide-bottom-space
    :rules="rules"
    :model-value="display_value"
    :stack-label="modelValue"
    :class="design === HOLIDAYS_PACKAGE_FORM_DESIGN ? 'egs-holidays-styles' : ''"
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
        color="primary"
        class="cursor-pointer"
        @click="disabled ? null : $emit('update:modelValue', !modelValue)"
        :name="modelValue ? 'check_box' : 'check_box_outline_blank'"
      />
    </template>
    <template v-if="modelValue" v-slot:control>
      <q-item-label lines="1">{{ display_value }}</q-item-label>
    </template>
    <template v-else v-slot:control>
      <q-item-label
        @click="disabled ? null : $emit('update:modelValue', !modelValue)"
        class="cursor-pointer text-caption"
      >
        <span dom-key="bundle.separate-check-inout">
          {{ $t('common.part-of-my-stay') }}
        </span>
      </q-item-label>
    </template>
    <q-popup-proxy
      ref="popup_proxy"
      v-if="modelValue"
      transition-show="scale"
      transition-hide="scale"
      :style="{ '--q-primary': color }"
    >
      <div style="max-width: 400px">
        <q-date
          :locale="my_locale"
          :class="design === HOLIDAYS_PACKAGE_FORM_DESIGN ? '' : 'eg-date-picker hide-year-navigation'"
          range
          minimal
          v-bind="v_bind"
          v-model="dates"
          :mask="date_format"
          :default-year-month="default_year_month"
          :options="validate_date"
          :style="design === HOLIDAYS_PACKAGE_FORM_DESIGN ? 'width: 400px;height: 400px;' : ''"
          @update:model-value="handle_date_changed"
        />
      </div>
    </q-popup-proxy>
  </q-field>
</template>
<script setup>
import { HOLIDAYS_PACKAGE_FORM_DESIGN } from 'src/constants'
import {
  convert_string_to_date,
  change_datetime_format,
  is_date_range_within_range
} from 'src/composables/utils'
import { defineProps, ref, watch, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  modelValue: { type: Boolean, required: true, default: false },
  flight_dates: {},
  hotel_dates: { type: Array, required: true },
  date_format: { type: String, default: 'YYYY-MM-DD' },
  display_format: { type: String, default: 'DD/MM/YYYY' },
  readonly: { type: Boolean },
  disabled: { type: Boolean },
  design: { type: String, default: '' },
  color: { type: String, default: 'primary' }
})

const dates = ref(null)

onMounted(() => {
  dates.value = {
    from: props.hotel_dates?.[0],
    to: props.hotel_dates?.[1]
  }
})

const my_locale = computed(() => ({
  days: t('components.date-picker.days').split('_'),
  daysShort: t('components.date-picker.day-short').split('_'),
  months: t('components.date-picker.months').split('_'),
  monthsShort: t('components.date-picker.months-short').split('_'),
  firstDayOfWeek: 1,
  format24h: true,
  pluralDay: 'days'
}))

const rules = ref([
  (v) => {
    if (!props.modelValue) return true
    return v !== 'Invalid date - Invalid date' || ''
  }
])


const popup_proxy = ref(null)

const handle_date_changed = (val) => {
  if(!val?.from || !val?.to) return
  props.hotel_dates[0] = val?.from
  props.hotel_dates[1] = val?.to
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
  return departure_date <= date && date <= return_date
}

const v_bind = computed(() => {
  let result = {
    minimal: true,
    range: true
  }
  return result
})

const default_year_month = computed(() => {
  if (props.flight_dates?.[0]) {
    let departure_date = convert_string_to_date(
      props.flight_dates?.[0],
      props.date_format
    )
    return departure_date.format('YYYY/MM')
  }
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
  (flight_dates) => {
    if(!is_date_range_within_range(flight_dates, props.hotel_dates)) {
      props.hotel_dates[0] = flight_dates[0]
      props.hotel_dates[1] = flight_dates[1]
    }
  }
)

defineExpose({
  open_dialog: () => {
    popup_proxy.value?.show?.()
  }
})
</script>
