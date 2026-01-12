<template>
  <q-form
    v-if="payload"
    @submit="submit"
    :key="JSON.stringify(payload.flight_dates)"
    greedy
  >
    <template v-if="design === EXPEDIA_PACKAGE_FORM_DESIGN">
      <div class="q-row q-col-gutter-md">
        <div class="q-col-12">
          <div class="q-row q-col-gutter-sm">
            <cabin-select
              dense
              v-model="payload.cabin_class"
              :rules="rules.cabin_class"
              outlined
              hide-bottom-space
              emit-value
              map-options
              :cabin_classes="product.cabin_classes"
              rounded
              :label="$t('common.cabin-class')"
              hide_label_mode
            />
            <star-select
              dense
              v-model="payload.stars"
              outlined
              hide-bottom-space
              emit-value
              map-options
              :label="$t('common.hotel-stars')"
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
                    range
                    dense
                    outlined
                    hide-bottom-space
                    :rules="rules.dates"
                    v-model="payload.flight_dates"
                    :date_format="date_format"
                    :booking_cutoff_days="bundle.booking_cutoff_days"
                    :label="$t('common.dates')"
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
                    :with_rooms="true"
                    :max_rooms="3"
                    :max_adults="+traveler_limits?.['adult']?.limit"
                    :max_infants="+traveler_limits?.['infant']?.limit"
                    :max_children="+traveler_limits?.['child']?.limit"
                    :traveler_limit_type="bundle?.traveler_limit_type"
                    :total_traveler_limit="bundle?.total_traveler_limit"
                    :traveler_types="product.traveler_types"
                    :default_traveler_count="bundle?.default_traveler_count"
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
        <div :class="class_name">
          <place-select
            city_code
            dense
            v-model="payload.dp_airport"
            :types="place_types"
            :rules="rules.place"
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
            :label="$t('common.origin')"
            :has_code="true"
            :color="color"
          />
        </div>
        <div :class="class_name">
          <place-select
            city_code
            dense
            :key="JSON.stringify(payload.ar_airport)"
            v-model="payload.ar_airport"
            :types="place_types"
            :rules="rules.place"
            :static_route_enabled="product.static_route_enabled"
            :destination_type="product.static_route_enabled ? 'arrival' : ''"
            outlined
            hide-bottom-space
            fill-input
            :departure_code="
              product.static_route_enabled && payload.dp_airport
                ? payload.dp_airport.code
                : ''
            "
            hide-selected
            prepend_icon="place"
            :label="$t('common.destination')"
            :has_code="true"
            :color="color"
          />
        </div>
        <div :class="class_name">
          <date-picker
            range
            dense
            outlined
            hide-bottom-space
            :rules="rules.dates"
            v-model="payload.flight_dates"
            :date_format="date_format"
            :booking_cutoff_days="bundle.booking_cutoff_days"
            :label="$t('common.departure-return')"
            :color="color"
          />
        </div>
        <div
          :class="class_name"
          v-if="context_store.viewport === DESKTOP_VIEWPORT"
        >
          <search-btn :label="$t('common.search-now')" :color="color" />
        </div>
        <div :class="class_name">
          <traveler-select
            dense
            v-model="payload.travelers"
            :rules="rules.travelers"
            outlined
            hide-bottom-space
            :with_rooms="true"
            :max_rooms="3"
            :max_adults="+traveler_limits?.['adult']?.limit"
            :max_infants="+traveler_limits?.['infant']?.limit"
            :max_children="+traveler_limits?.['child']?.limit"
            :traveler_limit_type="bundle?.traveler_limit_type"
            :total_traveler_limit="bundle?.total_traveler_limit"
            :traveler_types="product.traveler_types"
            :default_traveler_count="bundle?.default_traveler_count"
            :label="$t('common.travelers')"
            :color="color"
          />
        </div>
        <div :class="class_name">
          <cabin-select
            dense
            v-model="payload.cabin_class"
            :rules="rules.cabin_class"
            outlined
            hide-bottom-space
            :cabin_classes="product.cabin_classes"
            emit-value
            map-options
            prepend_icon="class"
            :label="$t('common.cabin-class')"
          />
        </div>
        <div :class="class_name">
          <separate-check-inout
            dense
            v-model="payload.form_data.separate"
            :flight_dates="payload.flight_dates"
            :date_format="date_format"
            :hotel_dates="payload.hotel_dates"
          />
        </div>
        <div
          :class="class_name"
          v-if="context_store.viewport !== DESKTOP_VIEWPORT"
        >
          <search-btn :label="$t('common.search-now')" :color="color" />
        </div>
      </div>
    </template>
  </q-form>
</template>
<script setup>
import { computed, defineEmits, onMounted } from 'vue'

import PlaceSelect from 'src/components/common/place-select'
import DatePicker from 'src/components/common/date-picker'
import TravelerSelect from 'src/components/common/traveler-select'
import CabinSelect from 'src/components/common/cabin-select'
import SeparateCheckInput from './separate-check-inout'
import AirportPicker from 'src/components/common/airport-picker'
import StarSelect from 'src/components/common/star-select'
import SearchBtn from '../search-btn'
import keyBy from 'lodash.keyby'
import cloneDeep from 'lodash.clonedeep'
import { storeToRefs } from 'pinia'
import { stores } from 'src/stores'
import { DESKTOP_VIEWPORT, EXPEDIA_PACKAGE_FORM_DESIGN } from 'src/constants'

const props = defineProps({
  bundle: { type: Object, required: true },
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
  () => package_store.payload[props.node?.id]?.['bundle']
)

const class_name = computed(() => {
  if (context_store.viewport === DESKTOP_VIEWPORT) {
    return 'q-col-3'
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

const traveler_limits = keyBy(props.bundle.traveler_limits, 'traveler_type')
const emit = defineEmits(['submit'])

const { date_format } = storeToRefs(context_store)

const place_types = computed(() => {
  return ['airport']
})

onMounted(() => {
  if (props.default_destination && payload.value) {
    payload.value.ar_airport = props.default_destination
  }
})

const rules = {
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

const buildExpectCodeAndType = (data) => {
  const { type, code, id } = data || {}
  let resultCode, resultType
  if (type === 'airport') {
    resultCode = code
    resultType = 'airport_code'
  } else if (['city', 'multi_city_vicinity', 'province_state'].includes(type)) {
    resultCode = code
    resultType = 'city_code'
  } else {
    resultCode = id
    resultType = 'place_id'
  }
  return [resultCode, resultType]
}

const submit = () => {
  const {
    travelers,
    cabin_class,
    flight_dates,
    dp_airport,
    ar_airport,
    hotel_dates,
    stars
  } = payload.value || {}

  let process = 'flight'

  if (props.bundle.bundled) {
    process = 'bundle'
  }
  let [start_place_code, start_place_type] = buildExpectCodeAndType(dp_airport),
    [des_code, des_type] = buildExpectCodeAndType(ar_airport),
    [ht_des_code, ht_des_type] = buildExpectCodeAndType(ar_airport)

  const data = {
    process,
    currency_code: context_store.currency?.code,
    language_code: context_store.language?.code,
    package_id: props.bundle.id,
    travelers: JSON.stringify(travelers),
    expectation: JSON.stringify({
      fl_cabin_class: cabin_class,
      fl_departure_date: flight_dates[0],
      fl_return_date: flight_dates[1],
      fl_round_trip: true,
      start_place_code,
      start_place_type,
      des_code: ar_airport.code,
      // des_code,
      des_type,
      ht_des_code,
      ht_des_type,
      ht_checkin_date: hotel_dates?.[0] || flight_dates[0],
      ht_checkout_date: hotel_dates?.[1] || flight_dates[1],
      stars: stars
    })
  }
  if (props.flight_campaign) {
    data.flight_campaign = props.flight_campaign
  }
  if (props.partner_id) {
    data.partner_id = props.flight_campaign
  }
  emit('submit', data)
}
</script>
