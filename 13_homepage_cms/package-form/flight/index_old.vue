<template>
  <q-form
    v-if="payload"
    @submit="submit"
    :key="JSON.stringify(payload.dates)"
    greedy
  >
    <template v-if="design === EXPEDIA_PACKAGE_FORM_DESIGN">
      <div class="q-row q-col-gutter-md">
        <div class="q-col-12">
          <div class="q-row q-col-gutter-sm">
            <route-switch
              v-model="payload.fl_round_trip"
              :color="color"
              type="tabs"
            />
            <cabin-select
              dense
              v-model="payload.cabin_class"
              :rules="rules.cabin_class"
              outlined
              hide-bottom-space
              emit-value
              map-options
              :cabin_classes="product.cabin_classes"
              :label="$t('common.cabin-class')"
              hide_label_mode
              rounded
            />
          </div>
        </div>
        <div class="q-col-12">
          <div class="q-row q-col-gutter-sm">
            <div v-bind="expedia_left_bind">
              <div class="q-row q-col-gutter-sm">
                <div :class="expedia_class_6">
                  <airport-picker
                    :product="product"
                    :color="color"
                    v-model="payload"
                    @handle_swap_airport="handle_swap_airport"
                    :has_code="true"
                  />
                </div>
                <div :class="expedia_class_3">
                  <date-picker
                    dense
                    outlined
                    hide-bottom-space
                    :booking_cutoff_days="flight.booking_cutoff_days"
                    :range="payload.fl_round_trip"
                    :rules="rules.dates"
                    v-model="payload.dates"
                    :label="
                      payload.fl_round_trip
                        ? $t('common.dates')
                        : $t('common.date')
                    "
                    display_format="MMM DD"
                    :color="color"
                  />
                </div>
                <div :class="expedia_class_3">
                  <traveler-select
                    dense
                    v-model="payload.travelers"
                    :rules="rules.travelers"
                    outlined
                    hide-bottom-space
                    :max_adults="+traveler_limits?.['adult']?.limit"
                    :max_infants="+traveler_limits?.['infant']?.limit"
                    :max_children="+traveler_limits?.['child']?.limit"
                    :traveler_limit_type="flight?.traveler_limit_type"
                    :total_traveler_limit="flight?.total_traveler_limit"
                    :traveler_types="product.traveler_types"
                    :default_traveler_count="flight?.default_traveler_count"
                    :label="$t('common.travelers')"
                    :color="color"
                  />
                </div>
              </div>
            </div>
            <div v-bind="expedia_right_bind">
              <search-btn
                :label="$t('common.search')"
                :color="color"
                rounded
                class="text-capitalize"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="q-row q-col-gutter-sm">
        <div class="q-col-12">
          <route-switch v-model="payload.fl_round_trip" :color="color" />
        </div>
        <div :class="className">
          <place-select
            cities_with_airports
            dense
            v-model="payload.dp_airport"
            :types="place_types"
            :rules="rules.dp_airport"
            outlined
            hide-bottom-space
            fill-input
            hide-selected
            :static_route_enabled="product.static_route_enabled"
            :destination_type="product.static_route_enabled ? 'departure' : ''"
            prepend_icon="flight_takeoff"
            :arrival_code="
              product.static_route_enabled && payload.ar_airport
                ? payload.ar_airport.code
                : ''
            "
            :has_code="true"
            :label="$t('common.origin')"
          />
        </div>
        <div :class="className">
          <place-select
            :key="JSON.stringify(payload.ar_airport)"
            cities_with_airports
            dense
            v-model="payload.ar_airport"
            :types="place_types"
            :rules="rules.ar_airport"
            outlined
            hide-bottom-space
            fill-input
            hide-selected
            :static_route_enabled="product.static_route_enabled"
            :destination_type="product.static_route_enabled ? 'arrival' : ''"
            prepend_icon="place"
            :label="$t('common.destination')"
            :has_code="true"
            :departure_code="
              product.static_route_enabled && payload.dp_airport
                ? payload.dp_airport.code
                : ''
            "
          />
        </div>
        <div :class="className">
          <date-picker
            dense
            outlined
            hide-bottom-space
            :booking_cutoff_days="flight.booking_cutoff_days"
            :range="payload.fl_round_trip"
            :rules="rules.dates"
            v-model="payload.dates"
            :color="color"
            :label="
              payload.fl_round_trip
                ? $t('common.departure-return')
                : $t('common.departure')
            "
          />
        </div>
        <div :class="className">
          <traveler-select
            dense
            hide-bottom-space
            v-model="payload.travelers"
            :rules="rules.travelers"
            outlined
            :max_adults="Number(traveler_limits?.['adult']?.limit)"
            :max_infants="Number(traveler_limits?.['infant']?.limit)"
            :max_children="Number(traveler_limits?.['child']?.limit)"
            :traveler_limit_type="flight?.traveler_limit_type"
            :total_traveler_limit="flight?.total_traveler_limit"
            :default_traveler_count="flight?.default_traveler_count"
            :traveler_types="product.traveler_types"
            :label="$t('common.travelers')"
            :color="color"
          />
        </div>
        <div :class="className">
          <cabin-select
            dense
            v-model="payload.cabin_class"
            :rules="rules.cabin_class"
            outlined
            hide-bottom-space
            emit-value
            map-options
            :cabin_classes="product.cabin_classes"
            prepend_icon="class"
            :label="$t('common.cabin-class')"
          />
        </div>
        <div :class="className">
          <search-btn :label="$t('common.search-now')" :color="color" />
        </div>
      </div>
    </template>
  </q-form>
</template>
<script setup>
import { computed, defineEmits, onMounted, watch } from 'vue'
import keyBy from 'lodash.keyby'
import cloneDeep from 'lodash.clonedeep'
import PlaceSelect from 'src/components/common/place-select'
import DatePicker from 'src/components/common/date-picker'
import TravelerSelect from 'src/components/common/traveler-select'
import CabinSelect from 'src/components/common/cabin-select'
import RouteSwitch from 'src/components/common/route-switch'
import SearchBtn from '../search-btn'
import AirportPicker from 'src/components/common/airport-picker'
import { DESKTOP_VIEWPORT, EXPEDIA_PACKAGE_FORM_DESIGN } from 'src/constants'
import { stores } from 'src/stores'

const props = defineProps({
  flight: { type: Object, required: true },
  product: { type: Object, required: true },
  styles: { type: Object },
  color: { type: String, default:'#1976d2' },
  flight_campaign: { type: String },
  partner_id: { type: String },
  default_destination: { type: Object },
  design: { type: String },
  node: { type: Object }
})

const context_store = stores.use_context()
const package_store = stores.use_package()
const payload = computed(
  () => package_store.payload[props.node?.id]?.['flight']
)

onMounted(() => {
  if (payload.value && props.default_destination)
    payload.value.ar_airport = props.default_destination
})

const className = computed(() => {
  if (context_store.viewport === DESKTOP_VIEWPORT) {
    return 'q-col-4'
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

const expedia_class_6 = computed(() => {
  if (context_store.viewport === DESKTOP_VIEWPORT) {
    return 'q-col-6'
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

const place_types = computed(() => {
  return ['airport']
})

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
    cabin_class,
    fl_round_trip,
    dates
  } = payload.value || {}

  let origin_type_dp_airport = 'airport_code',
    origin_type_ar_airport = 'airport_code'

  if (
    ['city', 'multi_city_vicinity', 'province_state'].includes(dp_airport.type)
  ) {
    origin_type_dp_airport = 'city_code'
  }

  if (
    ['city', 'multi_city_vicinity', 'province_state'].includes(ar_airport.type)
  ) {
    origin_type_ar_airport = 'city_code'
  }

  const data = {
    process: 'flight',
    currency_code: context_store.currency?.code,
    language_code: context_store.language?.code,
    package_id: props.flight.id,
    travelers: JSON.stringify(travelers),
    expectation: JSON.stringify({
      start_place_code: dp_airport.code,
      start_place_type: origin_type_dp_airport,
      des_code: ar_airport.code,
      des_type: origin_type_ar_airport,
      fl_cabin_class: cabin_class,
      fl_departure_date: fl_round_trip ? dates[0] : dates,
      fl_return_date: fl_round_trip ? dates[1] : dates,
      fl_round_trip: fl_round_trip
    })
  }
  if (props.flight_campaign) {
    data.flight_campaign = props.flight_campaign
  }
  if (props.partner_id) {
    data.partner_id = props.partner_id
  }
  emit('submit', data)
}
</script>
