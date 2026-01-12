<template>
  <q-form
    v-if="payload"
    @submit="submit"
    :key="JSON.stringify(payload.pickup_time)"
    greedy
  >
    <div class="q-row q-col-gutter-sm">
      <div :class="className">
        <place-select
          :key="JSON.stringify(payload.pickup_location)"
          dense
          v-model="payload.pickup_location"
          :types="place_types"
          :rules="rules.place"
          outlined
          hide-bottom-space
          fill-input
          hide-selected
          prepend_icon="place"
          :label="$t('common.pickup-location')"
          :color="color"
        />
      </div>
      <div :class="className">
        <date-picker
          dense
          outlined
          hide-bottom-space
          :booking_cutoff_days="car_rental.booking_cutoff_days"
          :rules="rules.dates"
          v-model="payload.pickup_date"
          :label="$t('common.pickup-date')"
          :color="color"
        />
      </div>
      <div :class="className">
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
      <div :class="className">
        <q-input
          dense
          v-model="payload.driver_age"
          :rules="rules.place"
          type="number"
          with_rooms
          outlined
          hide-bottom-space
          :label="$t('common.driver-age')"
        >
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>
      </div>
      <div :class="className">
        <different-dropoff-location
          :place_types="place_types"
          :form_data="payload.dropoff_data"
          v-model="payload.diff_dropoff"
        />
      </div>
      <div :class="className">
        <date-picker
          dense
          outlined
          hide-bottom-space
          :booking_cutoff_days="car_rental.booking_cutoff_days"
          :rules="rules.dates"
          v-model="payload.dropoff_date"
          :label="$t('common.dropoff-date')"
          :color="color"
        />
      </div>
      <div :class="className">
        <time-picker
          dense
          outlined
          hide-bottom-space
          :rules="rules.dates"
          v-model="payload.dropoff_time"
          :label="$t('common.dropoff-time')"
          :color="color"
        />
      </div>
      <div :class="className">
        <search-btn :label="$t('common.search-now')" :color="color" />
      </div>
    </div>
  </q-form>
</template>
<script setup>
import { computed, defineProps, defineEmits, onMounted } from 'vue'

import PlaceSelect from 'src/components/common/place-select/index.vue'
import DatePicker from 'src/components/common/date-picker/index.vue'
import TimePicker from 'src/components/common/time-picker/index.vue'
import DifferentDropoffLocation from './different-dropoff-location/index.vue'
import SearchBtn from '../search-btn/index.vue'
import { stores } from 'src/stores'
import { DESKTOP_VIEWPORT } from 'src/constants'

const emit = defineEmits(['submit'])
const props = defineProps({
  car_rental: { type: Object, required: true },
  styles: { type: Object },
  color: { type: String, default: '#1976d2' },
  flight_campaign: { type: String },
  partner_id: { type: String },
  default_destination: { type: Object },
  node: { type: Object }
})

const context_store = stores.use_context()
const package_store = stores.use_package()
const payload = computed(() => package_store.payload[props.node?.id]?.['car'])

const className = computed(() => {
  if (context_store.viewport === DESKTOP_VIEWPORT) {
    return 'q-col-3'
  } else {
    return 'q-col-12'
  }
})

onMounted(() => {
  if (props.default_destination && payload.value) {
    payload.value.pickup_location = props.default_destination
  }
})

const place_types = computed(() => {
  return ['airport']
})

const rules = {
  dates: [(val) => !!val || 'Required'],
  place: [(val) => !!val || 'Required'],
  travelers: []
}

const submit = () => {
  const {
    driver_age,
    diff_dropoff,
    pickup_location,
    pickup_date,
    pickup_time,
    dropoff_data,
    dropoff_date,
    dropoff_time
  } = payload.value || {}

  const data = {
    process: 'car_rental',
    currency_code: context_store.currency?.code,
    language_code: context_store.language?.code,
    package_id: props.car_rental.id,
    travelers: JSON.stringify([]),
    expectation: JSON.stringify({
      cr_driver_age: driver_age,
      cr_diff_dropoff_location: diff_dropoff,
      cr_pickup_place_code:
        pickup_location.type === 'airport' ? pickup_location.code : null,
      cr_pickup_date: pickup_date,
      cr_pickup_time: pickup_time,
      cr_pickup_place_type: 'airport_code',
      cr_dropoff_place_code: dropoff_data.dropoff_location?.code,
      cr_dropoff_date: dropoff_date,
      cr_dropoff_time: dropoff_time,
      cr_dropoff_place_type: 'airport_code',
      is_separate: false
    }),
    flight_campaign: props.flight_campaign,
    partner_id: props.partner_id
  }
  emit('submit', data)
}
</script>
