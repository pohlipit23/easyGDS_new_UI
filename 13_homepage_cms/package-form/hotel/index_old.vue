<template>
  <q-form
    v-if="payload"
    :key="JSON.stringify(payload.dates)"
    class="full-width"
    @submit="submit"
    greedy
  >
    <!-- expedia design -->
    <template v-if="design === EXPEDIA_PACKAGE_FORM_DESIGN">
      <div class="q-row q-col-gutter-sm">
        <div v-bind="expedia_left_bind">
          <div class="q-row q-col-gutter-sm">
            <div :class="expedia_class_name">
              <place-select
                dense
                outlined
                hide-bottom-space
                fill-input
                hide-selected
                prepend_icon="place"
                disable_loadmore
                with_properties
                hotel_places
                :key="JSON.stringify(payload.place)"
                v-model="payload.place"
                :types="place_types"
                :rules="rules.place"
                :label="$t('common.going-to')"
                :color="color"
              />
            </div>
            <div :class="expedia_class_name">
              <date-picker
                range
                dense
                outlined
                hide-bottom-space
                :booking_cutoff_days="hotel.booking_cutoff_days"
                :rules="rules.dates"
                v-model="payload.dates"
                :label="$t('common.dates')"
                display_format="MMM DD"
                :color="color"
              />
            </div>
            <div :class="expedia_class_name">
              <traveler-select
                dense
                v-model="payload.travelers"
                :max_rooms="3"
                :rules="rules.travelers"
                :max_adults="+traveler_limits?.['adult']?.limit"
                :max_infants="+traveler_limits?.['infant']?.limit"
                :max_children="+traveler_limits?.['child']?.limit"
                :traveler_limit_type="hotel?.traveler_limit_type"
                :total_traveler_limit="hotel?.total_traveler_limit"
                :default_traveler_count="hotel?.default_traveler_count"
                :traveler_types="product.traveler_types"
                with_rooms
                outlined
                hide-bottom-space
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
    </template>

    <!-- default design -->
    <template v-else>
      <div class="q-row q-col-gutter-sm">
        <div :class="className">
          <place-select
            dense
            outlined
            hide-bottom-space
            fill-input
            hide-selected
            prepend_icon="place"
            disable_loadmore
            with_properties
            hotel_places
            :key="JSON.stringify(payload.place)"
            v-model="payload.place"
            :types="place_types"
            :rules="rules.place"
            :label="$t('common.where-are-you-going')"
            :color="color"
          />
        </div>
        <div :class="className">
          <date-picker
            range
            dense
            outlined
            hide-bottom-space
            :booking_cutoff_days="hotel.booking_cutoff_days"
            :rules="rules.dates"
            v-model="payload.dates"
            :label="$t('common.checkin-checkout')"
            :color="color"
          />
        </div>
        <div :class="className">
          <traveler-select
            dense
            v-model="payload.travelers"
            :max_rooms="3"
            :rules="rules.travelers"
            :max_adults="+traveler_limits?.['adult']?.limit"
            :max_infants="+traveler_limits?.['infant']?.limit"
            :max_children="+traveler_limits?.['child']?.limit"
            :traveler_limit_type="hotel?.traveler_limit_type"
            :total_traveler_limit="hotel?.total_traveler_limit"
            :default_traveler_count="hotel?.default_traveler_count"
            :traveler_types="product.traveler_types"
            with_rooms
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
    </template>
  </q-form>
</template>
<script setup>
import { computed, defineEmits, onMounted } from 'vue'
import keyBy from 'lodash.keyby'
import PlaceSelect from 'src/components/common/place-select'
import DatePicker from 'src/components/common/date-picker'
import TravelerSelect from 'src/components/common/traveler-select'
import SearchBtn from '../search-btn'
import { stores } from 'src/stores'
import { EXPEDIA_PACKAGE_FORM_DESIGN, DESKTOP_VIEWPORT } from 'src/constants'
import isNumber from 'lodash.isnumber'

const emit = defineEmits(['submit'])

const props = defineProps({
  product: { type: Object, required: true },
  hotel: { type: Object, required: true },
  styles: { type: Object },
  color: { type: String, default: '#1976d2' },
  flight_campaign: { type: String },
  partner_id: { type: String },
  default_destination: { type: Object },
  design: { type: String },
  node: { type: Object }
})

const context_store = stores.use_context()
const package_store = stores.use_package()
const payload = computed(() => package_store.payload[props.node?.id]?.['hotel'])

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

const expedia_class_name = computed(() => {
  if (context_store.viewport === DESKTOP_VIEWPORT) {
    return 'q-col-4'
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

const traveler_limits = keyBy(props.hotel.traveler_limits, 'traveler_type')

const place_types = computed(() => {
  return ['province_state', 'multi_city_vicinity', 'airport', 'city']
})

const rules = {
  dates: [(val) => !!val || 'Required'],
  place: [(val) => !!val || 'Required'],
  travelers: []
}

const submit = () => {
  const { travelers, place, dates } = payload.value || {}

  emit('submit', {
    process: 'hotel',
    place_type: isNumber(place?.star) ? 'hotel' : place.type,
    place_id: place.id,
    currency_code: context_store.currency?.code,
    language_code: context_store.language?.code,
    package_id: props.hotel.id,
    travelers: JSON.stringify(travelers),
    expectation: JSON.stringify({
      ht_des_code: place?.type === 'airport' ? place?.code : place?.id,
      ht_checkin_date: dates[0],
      ht_checkout_date: dates[1],
      ht_des_type: place?.type === 'airport' ? 'airport_code' : 'place_id',
      is_separate: false
    }),
    flight_campaign: props.flight_campaign,
    partner_id: props.partner_id
  })
}
</script>
