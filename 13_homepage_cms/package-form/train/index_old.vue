<template>
  <q-form
    v-if="payload"
    @submit="submit"
    :key="JSON.stringify({dates: payload.dates, travelers: payload.travelers})"
    greedy
  >
    <div class="q-row q-col-gutter-md">
      <div class="q-col-12">
        <div class="q-row q-col-gutter-sm">
          <div v-bind="expedia_left_bind">
            <div class="q-row q-col-gutter-sm">
              <div class="q-col-12">
                <route-switch v-model="payload.tn_round_trip" :color="color" />
              </div>
              <div :class="expedia_class_6">
                <airport-picker
                  :product="product"
                  :color="color"
                  :place_types="['railway_station']"
                  :has_code="true"
                  :cities_with_airports="false"
                  v-model="payload"
                  @handle_swap_airport="handle_swap_airport"
                />
              </div>
              <div :class="expedia_class_3">
                <date-picker
                  dense
                  outlined
                  hide-bottom-space
                  :booking_cutoff_days="flight.booking_cutoff_days"
                  :range="payload.tn_round_trip"
                  :rules="rules.dates"
                  v-model="payload.dates"
                  :color="color"
                  :label="
                    payload.tn_round_trip
                      ? $t('common.departure-return')
                      : $t('common.departure')
                  "
                />
              </div>
              <div :class="expedia_class_3">
                <traveler-select
                  dense
                  outlined
                  hide-bottom-space
                  show_group_booking="B2B"
                  v-model="payload.travelers"
                  :rules="rules.travelers"
                  :max_adults="+traveler_limits?.['adult']?.limit"
                  :max_infants="+traveler_limits?.['infant']?.limit"
                  :max_children="+traveler_limits?.['child']?.limit"
                  :traveler_limit_type="flight?.traveler_limit_type"
                  :total_traveler_limit="flight?.total_traveler_limit"
                  :traveler_types="product.traveler_types"
                  :default_traveler_count="flight?.default_traveler_count"
                  :label="$t('common.travelers')"
                  :color="color"
                  :payload="payload"
                />
              </div>
              <div :class="expedia_class_1">
                <search-btn
                  :label="$t('common.search')"
                  :color="color"
                  class="text-capitalize"
                />
              </div>
            </div>
          </div>
          <!-- <div v-bind="expedia_right_bind">
            <search-btn
              :label="$t('common.search')"
              :color="color"
              class="text-capitalize"
            />
          </div> -->
        </div>
      </div>
    </div>
  </q-form>
</template>
<script setup>
import { computed, defineEmits, onMounted } from 'vue'
import keyBy from 'lodash.keyby'
import cloneDeep from 'lodash.clonedeep'
import DatePicker from 'src/components/common/date-picker'
import TravelerSelect from 'src/components/common/traveler-select'
import SearchBtn from '../search-btn'
import AirportPicker from 'src/components/common/airport-picker'
import RouteSwitch from 'src/components/common/route-switch'

import { DESKTOP_VIEWPORT } from 'src/constants'
import { stores } from 'src/stores'

const props = defineProps({
  flight: { type: Object, required: true },
  product: { type: Object, required: true },
  styles: { type: Object },
  color: { type: String, default: '#1976d2' },
  flight_campaign: { type: String },
  partner_id: { type: String },
  default_destination: { type: Object },
  design: { type: String },
  node: { type: Object },
  setting: { type: Object }
})

const context_store = stores.use_context()
const package_store = stores.use_package()
const payload = computed(
  () => package_store.payload[props.node?.id]?.['flight']
)

onMounted(() => {
  if (payload.value && props.default_destination) {
    payload.value.ar_airport = props.default_destination
  }
  const default_values = props.setting?.default_values ?? {}

  if (default_values?.dates) {
    payload.value.dates = default_values.dates
  }

  if (default_values?.ar_airport) {
    payload.value.ar_airport = default_values.ar_airport
  }

  if (default_values?.dp_airport) {
    payload.value.dp_airport = default_values.dp_airport
  }

  if (default_values?.travelers) {
    payload.value.travelers = default_values.travelers
  }

  if (default_values?.group_booking !== undefined) {
    payload.value.group_booking = Boolean(default_values.group_booking)
  }

  if (default_values?.tn_round_trip !== undefined) {
    payload.value.tn_round_trip = Boolean(default_values.tn_round_trip)
  }
})

const className = computed(() => {
  if (context_store.viewport === DESKTOP_VIEWPORT) {
    return 'q-col-4'
  } else {
    return 'q-col-12'
  }
})

const expedia_class_1 = computed(() => {
  if (context_store.viewport === DESKTOP_VIEWPORT) {
    return 'q-col-1'
  } else {
    return 'q-col-12'
  }
})

const expedia_class_3 = computed(() => {
  if (context_store.viewport === DESKTOP_VIEWPORT) {
    return 'q-col-3'
  } else {
    return 'q-col-12'
  }
})

const expedia_class_4 = computed(() => {
  if (context_store.viewport === DESKTOP_VIEWPORT) {
    return 'q-col-4'
  } else {
    return 'q-col-12'
  }
})

const expedia_class_6 = computed(() => {
  if (context_store.viewport === DESKTOP_VIEWPORT) {
    return 'q-col-5'
  } else {
    return 'q-col-12'
  }
})

const expedia_left_bind = computed(() => {
  if (context_store.viewport === DESKTOP_VIEWPORT) {
    return {
      style: 'flex: 1'
    }
  } else {
    return {
      class: 'q-col-12'
    }
  }
})

const expedia_right_bind = computed(() => {
  if (context_store.viewport === DESKTOP_VIEWPORT) {
    return {
      style: 'width: 100px'
    }
  } else {
    return {
      class: 'q-col-12'
    }
  }
})

const emit = defineEmits(['submit'])
const traveler_limits = keyBy(props.flight.traveler_limits, 'traveler_type')

const rules = {
  dp_airport: [(v) => !!v || ''],
  ar_airport: [(v) => !!v || ''],
  dates: [(val) => !!val || ''],
  place: [(val) => !!val || ''],
  cabin_class: [(val) => !!val || ''],
  travelers: []
}

const handle_swap_airport = () => {
  const origin = cloneDeep(payload.value.dp_airport)
  const destination = cloneDeep(payload.value.ar_airport)
  payload.value.ar_airport = origin
  payload.value.dp_airport = destination
}

const submit = () => {
  const {
    travelers,
    ar_airport,
    dp_airport,
    dates,
    group_booking,
    tn_round_trip
  } = payload.value || {}

  const data = {
    process: 'train',
    product_code: 'train',
    type: 'railway_station',
    currency_code: context_store.currency?.code,
    language_code: context_store.language?.code,
    package_id: props.flight.id,
    travelers: JSON.stringify(travelers),
    group_booking: Boolean(group_booking),
    expectation: JSON.stringify({
      tn_departure_code: dp_airport.code,
      tn_departure_type: dp_airport.type,
      tn_arrival_code: ar_airport.code,
      tn_arrival_type: ar_airport.type,
      tn_return_date: tn_round_trip ? dates[1] : null,
      tn_departure_date:  tn_round_trip ? dates[0] : dates,
      tn_round_trip: tn_round_trip,
      group_booking: Boolean(group_booking)
    })
  }
  emit('submit', data)
}
</script>
