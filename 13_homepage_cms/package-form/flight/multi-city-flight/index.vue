<template>
  <div class="q-row q-col-gutter-sm">
    <div class="q-col-12">
      <div class="q-row q-col-gutter-sm">
        <div class="q-col-12">
          <div class="q-row justify-between">
            <div class="text">Flight {{ index + 1 }}</div>
            <q-btn
              v-if="Number(index) > 1"
              color="red"
              dense
              flat
              icon="remove"
              outline
              size="sm"
              @click="$emit('remove_flight', index)"
            >
              remove
            </q-btn>
          </div>
        </div>
        <div :class="item_class">
          <place-select
            ref="dp_airport_comp"
            v-model="modelValue.cities[index].dp_airport"
            :arrival_code="
              product.static_route_enabled && modelValue.ar_airport
                ? modelValue.ar_airport.code
                : ''
            "
            :destination_type="product.static_route_enabled ? 'departure' : ''"
            :has_code="true"
            :label="$t('common.origin')"
            :rules="rules.dp_airport"
            :static_route_enabled="product.static_route_enabled"
            :types="place_types"
            @update:model-value="
              (val) => handle_update_airport('dp_airport', index, val)
            "
            cities_with_airports
            dense
            fill-input
            hide-bottom-space
            hide-selected
            outlined
            prepend_icon="flight_takeoff"
            @done="ar_airport_comp?.open_dialog?.()"
          />
        </div>
        <div :class="item_class">
          <place-select
            ref="ar_airport_comp"
            v-model="modelValue.cities[index].ar_airport"
            :arrival_code="
              product.static_route_enabled && modelValue.ar_airport
                ? modelValue.ar_airport.code
                : ''
            "
            :destination_type="product.static_route_enabled ? 'arrival' : ''"
            :has_code="true"
            :label="$t('common.destination')"
            :rules="rules.ar_airport"
            :static_route_enabled="product.static_route_enabled"
            :types="place_types"
            @update:model-value="
              (val) => handle_update_airport('ar_airport', index, val)
            "
            cities_with_airports
            dense
            fill-input
            hide-bottom-space
            hide-selected
            outlined
            prepend_icon="place"
            @done="date_picker_comp?.open_dialog?.()"
          />
        </div>
        <div :class="item_class">
          <date-picker
            ref="date_picker_comp"
            v-model="modelValue.cities[index].dates"
            :booking_cutoff_days="flight.booking_cutoff_days"
            :color="color"
            :label="
              modelValue.fl_round_trip
                ? $t('common.departure-return')
                : $t('common.departure')
            "
            :validate="(date) => validate_date(index, date)"
            :range="false"
            :rules="rules.dates"
            @update:model-value="(val) => handle_update_date(index, val)"
            dense
            hide-bottom-space
            outlined
            :default_year_month="default_month"
            :key="default_month"
            @done="emit('done')"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import clone_deep from 'lodash.clonedeep'
import PlaceSelect from 'src/components/common/place-select/index.vue'
import DatePicker from 'src/components/common/date-picker/index.vue'
import { formatDate, get_current_month_string } from 'src/composables/utils'

const props = defineProps({
  modelValue: { type: Object },
  color: { type: String, default: '#1976d2' },
  direction: { type: String, default: 'row' },
  place_types: { type: Array, default: () => [] },
  product: { type: Object },
  rules: { type: Object },
  flight: { type: Object },
  index: { type: Number },
  handle_update_airport: {
    type: Function,
    default: () => {}
  },
  validate_date: {
    type: Function,
    default: () => {}
  },
  handle_update_date: {
    type: Function,
    default: () => {}
  },
  payload: { type: Object }
})

const dp_airport_comp = ref(null)
const ar_airport_comp = ref(null)
const date_picker_comp = ref(null)

const emit = defineEmits(['done'])

const default_month = computed(() => {
  const dates = clone_deep(props.modelValue.cities).map((x) => x.dates)

  return dates[props.index - 1]
    ? formatDate(dates[props.index - 1], 'YYYY/MM')
    : get_current_month_string()
})

const item_class = computed(() => {
  return props.direction === 'row' ? 'q-col-4' : 'q-col-12'
})

const open_dialog = () => {
  dp_airport_comp.value?.open_dialog()
}

defineExpose({
  open_dialog,
  index: props.index
})
</script>
