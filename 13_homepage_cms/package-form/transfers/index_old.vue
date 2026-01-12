<template>
  <q-form
    @submit="submit"
    v-if="payload"
    :key="JSON.stringify(payload.pickup_date)"
    greedy
  >
    <div class="q-row">
      <div class="q-col-12">
        <div class="q-col-gutter-sm">
          <div class="q-row q-col-gutter-sm">
            <div :class="classCol6Col2">
              <location-picker
                :node="node"
                :from_airport="payload.from_airport"
                :default_destination="default_destination"
              />
            </div>
            <div :class="classCol3Col2">
              <traveler-select
                dense
                v-model="payload.travelers"
                :rules="rules.travelers"
                :max_adults="+traveler_limits?.['adult']?.limit"
                :max_infants="+traveler_limits?.['infant']?.limit"
                :max_children="+traveler_limits?.['child']?.limit"
                :traveler_limit_type="transfer?.traveler_limit_type"
                :total_traveler_limit="transfer?.total_traveler_limit"
                :traveler_types="product.traveler_types"
                :default_traveler_count="transfer?.default_traveler_count"
                outlined
                hide-bottom-space
                :label="$t('common.travelers')"
                :color="color"
              />
            </div>
            <div
              v-if="context_store.viewport === DESKTOP_VIEWPORT"
              class="q-col-3"
            >
              <search-btn :label="$t('common.search-now')" :color="color" />
            </div>
          </div>
          <div class="q-row q-col-gutter-sm">
            <div :class="classCol9Col2">
              <div class="q-row q-col-gutter-sm">
                <div :class="classCol4Col12">
                  <date-picker
                    dense
                    outlined
                    hide-bottom-space
                    :booking_cutoff_days="transfer.booking_cutoff_days"
                    :rules="rules.dates"
                    v-model="payload.pickup_date"
                    :label="$t('common.pickup-date')"
                    :color="color"
                  />
                </div>
                <div :class="classCol4Col12">
                  <time-picker
                    dense
                    outlined
                    hide-bottom-space
                    :rules="rules.dates"
                    v-model="payload.pickup_time"
                    :label="$t('common.pickup-time')"
                    :color="color"
                  />
                </div>
                <!-- <div v-if="payload.round_trip" :class="classCol3Col2">
                  <date-picker dense outlined hide-bottom-space :rules="rules.dates" v-model="payload.return_date"
                    :label="$t('common.return-date')" />
                </div>
                <div v-if="payload.round_trip" :class="classCol3Col2">
                  <time-picker dense outlined hide-bottom-space :rules="rules.dates" v-model="payload.return_time"
                    :label="$t('common.return-time')" />
                </div> -->
              </div>
            </div>
          </div>
          <div
            v-if="context_store.viewport !== DESKTOP_VIEWPORT"
            class="q-col-12"
          >
            <search-btn :label="$t('common.search-now')" :color="color" />
          </div>
        </div>
      </div>
    </div>
  </q-form>
</template>
<script setup>
import { computed, defineEmits, onMounted } from 'vue'
import DatePicker from 'src/components/common/date-picker/index.vue'
import TimePicker from 'src/components/common/time-picker/index.vue'
import TravelerSelect from 'src/components/common/traveler-select/index.vue'
import LocationPicker from './location-picker/index.vue'
import SearchBtn from '../search-btn/index.vue'
import keyBy from 'lodash.keyby'
import { stores } from 'src/stores'
import { DESKTOP_VIEWPORT } from 'src/constants'
import isNumber from 'lodash.isnumber'

const props = defineProps({
  product: { type: Object, required: true },
  transfer: { type: Object, required: true },
  styles: { type: Object },
  color: { type: String, default:'#1976d2' },
  flight_campaign: { type: String },
  partner_id: { type: String },
  default_destination: { type: Object },
  node: { type: Object }
})

const context_store = stores.use_context()
const package_store = stores.use_package()
const payload = computed(
  () => package_store.payload[props.node?.id]?.['transfer']
)

const classCol6Col2 = computed(() => {
  if (context_store.viewport === DESKTOP_VIEWPORT) {
    return 'q-col-6'
  } else {
    return 'q-col-12'
  }
})

const classCol3Col2 = computed(() => {
  if (context_store.viewport === DESKTOP_VIEWPORT) {
    return 'q-col-3'
  } else {
    return 'q-col-12'
  }
})

const classCol9Col2 = computed(() => {
  if (context_store.viewport === DESKTOP_VIEWPORT) {
    return 'q-col-9'
  } else {
    return 'q-col-12'
  }
})

const classCol4Col12 = computed(() => {
  if (context_store.viewport === DESKTOP_VIEWPORT) {
    return 'q-col-4'
  } else {
    return 'q-col-12'
  }
})

const emit = defineEmits(['submit'])

const traveler_limits = keyBy(props.transfer.traveler_limits, 'traveler_type')

onMounted(() => {
  if (props.default_destination && payload.value) {
    payload.value.ar_airport = props.default_destination
  }
})

const rules = {
  dates: [(val) => !!val || 'Required'],
  place: [(val) => !!val || 'Required'],
  travelers: []
}

const submit = () => {
  const {
    pickup_date,
    pickup_time,
    travelers,
    from_airport,
    round_trip,
    return_date,
    return_time,
    airport,
    destination
  } = payload.value || {}

  const data = {
    process: 'transfer',
    currency_code: context_store.currency?.code,
    language_code: context_store.language?.code,
    package_id: props.transfer.id,
    travelers: JSON.stringify(travelers),
    expectation: JSON.stringify({
      is_separate: false,
      tf_airport_code: airport.code,
      tf_from_airport: from_airport,
      tf_pickup_date: pickup_date,
      tf_pickup_time: pickup_time,
      tf_place_code: destination.id,
      tf_place_type: isNumber(destination.star) ? 'property_id' : 'place_id',
      tf_return_date: round_trip ? return_date : null,
      tf_return_time: round_trip ? return_time : null,
      tf_round_trip: false
    }),
    flight_campaign: props.flight_campaign,
    partner_id: props.partner_id
  }
  emit('submit', data)
}
</script>
