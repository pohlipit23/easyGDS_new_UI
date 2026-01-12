<template>
  <div class="q-row q-col-gutter-sm text-capitalize" style="position: relative">
    <div
      class="q-col-6 col-md-6"
      :style="payload.from_airport ? '' : 'order: 1'"
    >
      <place-select
        ref="airport_comp" 
        dense
        v-model="payload.airport"
        :types="['airport']"
        :rules="rules.airport"
        outlined
        hide-bottom-space
        fill-input
        hide-selected
        prepend_icon="flight"
        :label="$t('common.airport')"
        :disable="disable"
        @done="destination_comp?.open_dialog?.()"
      />
    </div>
    <div class="q-col-6 col-md-6">
      <place-select
        dense
        ref="destination_comp"
        v-model="payload.destination"
        :types="['city,point_of_interest', 'administrative_area_level_4']"
        :rules="rules.destination"
        :longitude="payload.airport?.location?.point?.coordinates?.[0]"
        :latitude="payload.airport?.location?.point?.coordinates?.[1]"
        outlined
        hide-bottom-space
        property_included
        fill-input
        hide-selected
        is_properties
        prepend_icon="hotel"
        :place_id="place_id"
        :label="$t('common.destination')"
        :disable="disable || disabled_destination"
        hotel_places
        @done="emit('done')"
      />
    </div>
    <q-btn
      :style="swap_btn_styles"
      :disable="disable"
      round
      class="bg-white egs-swap-transfer-route-btn"
      icon="swap_horiz"
      outline
      @click="payload.from_airport = !payload.from_airport"
      dense
    />
  </div>
</template>
<script setup>
import PlaceSelect from 'src/components/common/place-select/index.vue'
import { computed, defineProps, onMounted, reactive, ref, defineEmits } from 'vue'
import { stores } from 'src/stores'
import groupBy from 'lodash.groupby'

const props = defineProps({
  color: { type: String },
  default_destination: { type: Object },
  node: { type: Object },
  disable: { type: Boolean, default: false },
  disabled_destination:{ type: Boolean, default: false }
})

const airport_comp = ref(null)
const destination_comp = ref(null)

const emit = defineEmits(['done'])

const rules = {
  airport: [(v) => !!v || ''],
  destination: [(v) => !!v || '']
}

const default_payload = reactive({
  airport: null,
  destination: null,
  from_airport: true,
  round_trip: true,
  pickup_date: null,
  pickup_time: null,
  return_date: null,
  return_time: null,
  travelers: []
})

const package_store = stores.use_package()
const payload = computed(
  () => package_store.payload[props.node?.id]?.['transfer'] || default_payload
)

const place_id = computed(() => {
  const ancestors = payload?.value.airport?.ancestors
  const ancestors_type = groupBy(ancestors, 'type')
  return (
    ancestors_type?.country?.[0]?.id ??
    ancestors_type?.city?.[0]?.id ??
    ancestors_type?.multi_city_vicinity?.[0]?.id ??
    ancestors_type?.province_state?.[0]?.id ??
    ''
  )
})

onMounted(() => {
  if (props.default_destination) {
    payload.value.destination = props.default_destination
  }
})

const swap_btn_styles = computed(() => {
  let result = {
    color: props.color
  }
  return result
})
</script>

<style lang='scss' scoped>
.egs-swap-transfer-route-btn {
    position: absolute !important;
    right: calc(50% - 16px - 4px);
    top: calc(50% - 16px + 4px);
    padding: 0;
    width: 32px !important;
    min-width: 32px !important;
    max-width: 32px !important;
    height: 32px !important;
    min-height: 32px !important;
    max-height: 32px !important;
    background: white !important;
    border-radius: 50% !important;
  }
  </style>