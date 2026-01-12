<template>
  <div v-if="payload" :key="render_key" :style="styles">
    <hotel-form
      v-if="product_combine === 'hotel'"
      :color="color"
      :default_destination="default_destination"
      :design="design"
      :flight_campaign="flight_campaign"
      :hotel="packages['hotel']"
      :node="node"
      :partner_id="partner_id"
      :place_types="place_types['hotel']"
      :product="products['hotel']"
      :setting="settings['hotel']"
      :styles="styles"
      @submit="handle_submit"
    />
    <stopover-form
      v-else-if="product_combine.includes('stopover')"
      :color="color"
      :default_destination="default_destination"
      :design="design"
      :flight_campaign="flight_campaign"
      :hotel="packages[product_combine]"
      :node="node"
      :partner_id="partner_id"
      :place_types="place_types['hotel']"
      :product="products['hotel']"
      :setting="settings['stopover']"
      :styles="styles"
      @submit="handle_submit"
    />
    <flight-form
      v-else-if="product_combine === 'flight'"
      :color="color"
      :default_destination="default_destination"
      :design="design"
      :flight="packages['flight']"
      :flight_campaign="flight_campaign"
      :node="node"
      :partner_id="partner_id"
      :place_types="place_types['flight']"
      :product="products['flight']"
      :setting="flight_settings"
      :styles="styles"
      @submit="handle_submit"
    />
    <bundle-form
      v-else-if="product_combine === 'flight--hotel'"
      :bundle="packages['flight--hotel']"
      :color="color"
      :default_destination="default_destination"
      :design="design"
      :flight_campaign="flight_campaign"
      :node="node"
      :partner_id="partner_id"
      :place_types="place_types['flight--hotel']"
      :product="products['flight']"
      :setting="settings['bundle']"
      :styles="styles"
      @submit="handle_submit"
    />
    <tour-form
      v-else-if="product_combine === 'tour'"
      :color="color"
      :default_destination="default_destination"
      :design="design"
      :flight_campaign="flight_campaign"
      :node="node"
      :partner_id="partner_id"
      :place_types="place_types['tour']"
      :product="products['tour']"
      :setting="settings['tour']"
      :styles="styles"
      :tour="packages['tour']"
      @submit="handle_submit"
    />
    <transfer-form
      v-else-if="product_combine === 'transfer'"
      :color="color"
      :default_destination="default_destination"
      :design="design"
      :flight_campaign="flight_campaign"
      :node="node"
      :partner_id="partner_id"
      :place_types="place_types['transfer']"
      :product="products['transfer']"
      :setting="settings['transfer']"
      :styles="styles"
      :transfer="packages['transfer']"
      @submit="handle_submit"
    />
    <car-rental-form
      v-else-if="product_combine === 'car_rental'"
      :car_rental="packages['car_rental']"
      :color="color"
      :default_destination="default_destination"
      :design="design"
      :flight_campaign="flight_campaign"
      :node="node"
      :partner_id="partner_id"
      :place_types="place_types['car_rental']"
      :product="products['car_rental']"
      :setting="settings['car_rental']"
      :styles="styles"
      @submit="handle_submit"
    />
    <tour-package-form
      v-else-if="product_combine === 'tour_package'"
      :color="color"
      :default_destination="default_destination"
      :design="design"
      :flight_campaign="flight_campaign"
      :node="node"
      :partner_id="partner_id"
      :place_types="place_types['tour_package']"
      :product="products['tour_package']"
      :setting="settings['tour_package']"
      :styles="styles"
      :tour_package="packages['tour_package']"
      @submit="handle_submit"
    />
    <train-form
      v-else-if="product_combine === 'train'"
      :color="color"
      :default_destination="default_destination"
      :design="design"
      :flight="packages['train']"
      :flight_campaign="flight_campaign"
      :node="node"
      :partner_id="partner_id"
      :place_types="place_types['train']"
      :product="products['train']"
      :setting="settings['train']"
      :styles="styles"
      @submit="handle_submit"
    />
    <train-hotel-form
      :flight_campaign="flight_campaign"
      :partner_id="partner_id"
      :default_destination="default_destination"
      :styles="styles"
      @submit="handle_submit"
      :color="color"
      :design="design"
      :package="packages['hotel--train']"
      :place_types="place_types['hotel--train']"
      :product="products['train']"
      :node="node"
      :setting="settings['hotel_train']"
      v-else-if="product_combine === 'hotel--train'"
    />
    <div v-else>
      <q-item-label caption class="text-center">
        Not supported for this combination
      </q-item-label>
    </div>
  </div>
</template>
<script setup>
import { computed, defineProps, onMounted, ref } from 'vue'
import is_empty from 'lodash.isempty'
import { stores } from 'src/stores'
import HotelForm from './hotel'
import FlightForm from './flight'
import BundleForm from './bundle'
import TourForm from './tour'
import TransferForm from './transfer'
import CarRentalForm from './car-rental'
import TourPackageForm from './tour-package'
import TrainForm from './train'
import StopoverForm from './stopover'
import TrainHotelForm from './train-hotel'


import { gen_uuid4, trigger_custom_event } from 'src/composables/utils'
import { PACKAGE_FROM_SUBMIT_EVENT } from 'src/composables/utils/forms'

import { check_cache_value, get_package_query, package_default_data, get_embed_property } from 'src/composables/utils/package-form'
import { inject_code, tracking_click_and_interaction, tracking_page_load } from 'src/composables/utils/adobe-tracking'
import { useRoute } from 'vue-router'


const props = defineProps({
  styles: { type: Object },
  color: { type: String },
  packages: { type: Object },
  products: { type: Object },
  product_combine: { type: String },
  handle_submit: { type: Function },
  default_destination: { type: Object },
  flight_campaign: { type: String },
  partner_id: { type: String },
  design: { type: String },
  node: { type: Object }
})

const route = useRoute()
const package_store = stores.use_package()
const context_store = stores.use_context()

const settings = computed(() => context_store.settings)
const head_injection = computed(() => context_store.app.cms_settings.head_injection)
const payload = computed(() => package_store.payload?.[props.node?.id])

const  flight_settings = computed(() => context_store.settings?.flight)

const render_key = ref(0)

const place_types = computed(() => {
  return {
    hotel: ['country', 'airport', 'administrative_area_level_4', 'administrative_area_level_3'],
    flight: ['airport'],
    tour: ['airport', 'administrative_area_level_4', 'administrative_area_level_3'],
    transfer: ['airport'],
    car_rental: ['airport'],
    tour_package: ['airport', 'administrative_area_level_4', 'administrative_area_level_3'],
    train: ['railway_station'],
    'flight--hotel': ['airport'],
    'hotel--train': ['railway_station']
  }
})

const handle_tracking = (data) => {
  tracking_click_and_interaction(data, props.node?.id)
}

const handle_submit = (data) => {
  if (!data.session_id) {
    data.session_id = route?.query?.session_id || gen_uuid4()
  }
  if (context_store.enable_submit_event) {
    trigger_custom_event(PACKAGE_FROM_SUBMIT_EVENT, data)
  } else {
    props.handle_submit(data)
  }
  handle_tracking(data)
}

const load_code_injection = () => {
  if (!head_injection.value) return
  inject_code(head_injection.value)
}

onMounted(async () => {
  if (is_empty(payload.value)) {
    package_store.payload[props.node.id] = package_default_data
  } else {
    check_cache_value(package_store.payload[props.node.id])
  }
  await get_package_query(package_store, props.node.id)
  await get_embed_property(context_store, package_store, {
    product: props.product_combine,
    place_types: place_types.value?.[props.product_combine],
    node_id: props.node.id
  })
  render_key.value += 1
  load_code_injection()
})
</script>
