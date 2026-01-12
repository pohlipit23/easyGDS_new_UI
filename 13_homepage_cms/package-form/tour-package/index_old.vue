<template>
  <q-form
    v-if="payload"
    :key="JSON.stringify(payload.dates)"
    @submit="submit"
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
          :label="$t('common.destination')"
        />
      </div>
      <div :class="className">
        <date-picker
          dense
          outlined
          hide-bottom-space
          :booking_cutoff_days="tour_package.booking_cutoff_days"
          :rules="rules.dates"
          v-model="payload.dates"
          :label="$t('common.departure')"
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
          :traveler_limit_type="tour_package?.traveler_limit_type"
          :total_traveler_limit="tour_package?.total_traveler_limit"
          :traveler_types="product.traveler_types"
          :default_traveler_count="tour_package?.default_traveler_count"
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

const props = defineProps({
  product: { type: Object, required: true },
  tour_package: { type: Object, required: true },
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
  () => package_store.payload[props.node?.id]?.['tour_package']
)

const className = computed(() => {
  if (context_store.viewport === DESKTOP_VIEWPORT) {
    return 'q-col-3'
  } else {
    return 'q-col-12'
  }
})

const emit = defineEmits(['submit'])

onMounted(() => {
  if (props.default_destination && payload.value) {
    payload.value.place = props.default_destination
  }
})

const traveler_limits = keyBy(
  props.tour_package.traveler_limits,
  'traveler_type'
)

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
    process: 'tour_package',
    currency_code: context_store.currency?.code,
    language_code: context_store.language?.code,
    package_id: props.tour_package.id,
    travelers: JSON.stringify(travelers),
    expectation: JSON.stringify({
      is_separate: false,
      tp_des_code: place.type === 'airport' ? place.code : place.id,
      tp_des_type: place.type === 'airport' ? 'airport_code' : 'place_id',
      tp_start_date: dates
    }),
    flight_campaign: props.flight_campaign,
    partner_id: props.partner_id
  })
}
</script>
