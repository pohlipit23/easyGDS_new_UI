<template>
  <q-form
    v-if="payload"
    @submit="submit"
    :key="JSON.stringify(payload.dates)"
    greedy
  >
    <div class="q-row q-col-gutter-sm">
      <div :class="className">
        <place-select
          :key="JSON.stringify(payload.place)"
          dense
          v-model="payload.place"
          :types="place_types"
          :rules="rules.place"
          outlined
          hide-bottom-space
          fill-input
          hide-selected
          prepend_icon="place"
          :label="$t('common.where-are-you-going')"
        />
      </div>
      <div :class="className">
        <date-picker
          range
          dense
          outlined
          hide-bottom-space
          :rules="rules.dates"
          :booking_cutoff_days="tour.booking_cutoff_days"
          v-model="payload.dates"
          :label="$t('common.checkin-checkout')"
          :color="color"
        />
      </div>
      <div :class="className">
        <traveler-select
          dense
          v-model="payload.travelers"
          :rules="rules.travelers"
          :max_adults="+traveler_limits?.['adult']?.limit"
          :max_infants="+traveler_limits?.['infant']?.limit"
          :max_children="+traveler_limits?.['child']?.limit"
          :traveler_limit_type="tour?.traveler_limit_type"
          :traveler_types="product.traveler_types"
          :total_traveler_limit="tour?.total_traveler_limit"
          :default_traveler_count="tour?.default_traveler_count"
          outlined
          hide-bottom-space
          :label="$t('common.travelers')"
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
import { computed, defineEmits, onMounted } from 'vue'

import PlaceSelect from 'src/components/common/place-select/index.vue'
import DatePicker from 'src/components/common/date-picker/index.vue'
import TravelerSelect from 'src/components/common/traveler-select/index.vue'
import SearchBtn from '../search-btn/index.vue'
import keyBy from 'lodash.keyby'
import { stores } from 'src/stores'
import { DESKTOP_VIEWPORT } from 'src/constants'

const emit = defineEmits(['submit'])

const props = defineProps({
  product: { type: Object, required: true },
  tour: { type: Object, required: true },
  styles: { type: Object },
  color: { type: String, default:'#1976d2' },
  flight_campaign: { type: String },
  partner_id: { type: String },
  default_destination: { type: Object },
  node: { type: Object }
})

const context_store = stores.use_context()
const package_store = stores.use_package()
const payload = computed(() => package_store.payload[props.node?.id]?.['tour'])

onMounted(() => {
  if (props.default_destination && payload.value) {
    payload.value.place = props.default_destination
  }
})

const className = computed(() => {
  if (context_store.viewport === DESKTOP_VIEWPORT) {
    return 'q-col-3'
  } else {
    return 'q-col-12'
  }
})

const traveler_limits = keyBy(props.tour.traveler_limits, 'traveler_type')

const place_types = computed(() => {
  return ['airport', 'province_state', 'multi_city_vicinity', 'city']
})

const rules = {
  dates: [(val) => !!val || 'Required'],
  place: [(val) => !!val || 'Required'],
  travelers: []
}

const submit = () => {
  const { travelers, place, dates } = payload.value || {}

  emit('submit', {
    process: 'tour',
    currency_code: context_store.currency?.code,
    language_code: context_store.language?.code,
    package_id: props.tour.id,
    travelers: JSON.stringify(travelers),
    expectation: JSON.stringify({
      is_separate: false,
      tr_des_code: place.type === 'airport' ? place.code : place.id,
      tr_des_type: place.type === 'airport' ? 'airport_code' : 'place_id',
      tr_start_date: dates[0],
      tr_end_date: dates[1]
    }),
    flight_campaign: props.flight_campaign,
    partner_id: props.partner_id
  })
}
</script>
