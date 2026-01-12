<template>
  <form-builder
    v-if="payload"
    :key="render_key"
    :fields="
      design === EXPEDIA_PACKAGE_FORM_DESIGN ? meta_expedia.fields : meta.fields
    "
    :node_id="node.id"
    :style="{ '--q-primary': color }"
    product_name="flight"
    @submit="submit"
  />
</template>
<script setup>
import { computed, defineEmits, onMounted, ref, nextTick} from 'vue'
import key_by from 'lodash.keyby'
import clone_deep from 'lodash.clonedeep'
import { EXPEDIA_PACKAGE_FORM_DESIGN } from 'src/constants'
import { stores } from 'src/stores'

import FormBuilder from 'src/components/common/form-builder'
import { get_meta_default } from './meta_default'
import { get_meta_expedia } from './meta_expedia'
import dayjs from 'dayjs'
import { use_services } from 'src/composables/services'
import { check_currency_based_departure } from 'src/composables/utils/package-form'

const props = defineProps({
  flight: { type: Object, required: true },
  product: { type: Object, required: true },
  styles: { type: Object },
  color: { type: String },
  flight_campaign: { type: String },
  partner_id: { type: String },
  default_destination: { type: Object },
  design: { type: String },
  node: { type: Object },
  setting: { type: Object },
  place_types: { type: Array, default: () => [] }
})

const services = use_services()
const context_store = stores.use_context()
const package_store = stores.use_package()
const payload = computed(
  () => package_store.payload[props.node?.id]?.['flight']
)
const render_key = ref(0)


onMounted(async () => {
  if (payload.value && props.default_destination) {
    payload.value.ar_airport = props.default_destination
  }
  
  const default_values = props.setting?.default_values ?? {}
  if (!default_values) return

  if (default_values?.fl_round_trip !== undefined) {
    payload.value.fl_round_trip = default_values.fl_round_trip
    await nextTick()
  }
  

  if (default_values?.dates) {
    if (
      payload?.value?.dates?.[0] &&
      payload?.value?.dates?.[1] &&
      typeof payload?.value?.dates !== 'string'
    ) {
      payload.value.dates[0] = default_values.dates[0]
      payload.value.dates[1] = default_values.dates[1]
    } else {
      payload.value.dates = clone_deep(default_values.dates)
    }
    await nextTick()
  }

  if (default_values?.travelers) {
    payload.value.travelers = default_values.travelers
  }
  if (default_values?.cabin_class) {
    payload.value.cabin_class = default_values.cabin_class
  }
  if (default_values?.ar_airport || default_values?.ar_airport === null) {
    payload.value.ar_airport = default_values.ar_airport
  }
  if (default_values?.dp_airport || default_values?.dp_airport === null) {
    payload.value.dp_airport = default_values.dp_airport
  }
  if (default_values?.fl_multi_city !== undefined) {
    payload.value.fl_multi_city = default_values.fl_multi_city
  }
  if (default_values?.cities) {
    payload.value.cities = clone_deep(default_values.cities)
    await nextTick()
    if (payload.value.cities?.length >= 1) {
      for (let i = 0; i < payload.value.cities?.length; i++) {
          payload.value.cities[i] = {
            ...payload.value.cities[i],
            dates: default_values.cities[i].dates,
            dp_airport: default_values.cities[i].dp_airport,
            ar_airport: default_values.cities[i].ar_airport
          }
      }
    }
  }
  render_key.value += 1
})

const rules = {
  dp_airport: [
    (val) => !!val || '',
    (v) => validate_duplicate_airport(v, 'dp_airport') || ''
  ],
  ar_airport: [
    (val) => !!val || '',
    (v) => validate_duplicate_airport(v, 'ar_airport') || ''
  ],
  dates: [(val) => !!val || ''],
  place: [(val) => !!val || ''],
  cabin_class: [(val) => !!val || ''],
  travelers: []
}

const validate_duplicate_airport = (value, type) => {
  if (type === 'ar_airport') {
    return value.id !== payload.value?.dp_airport?.id
  }
  if (type === 'dp_airport') {
    return value.id !== payload.value?.ar_airport?.id
  }
}

const rules_multi_city = (index) => ({
  dp_airport: [
    (v) => validate_airport(v, index) || '',
    (v) => validate_duplicate_multi_airport(v, 'dp_airport', index) || ''
  ],
  ar_airport: [
    (v) => validate_airport(v, index) || '',
    (v) => validate_duplicate_multi_airport(v, 'ar_airport', index) || ''
  ],
  dates: [(v) => !!v || '']
})

const validate_duplicate_multi_airport = (value, type, index) => {
  const leg = payload.value?.cities?.[index] || {}
  if (type === 'ar_airport') {
    return value.id !== leg?.dp_airport?.id
  }
  if (type === 'dp_airport') {
    return value.id !== leg?.ar_airport?.id
  }
}

const check_duplicate = (array, target_string) => {
  let count = 0
  for (let i = 0; i < array.length; i++) {
    if (array[i] === target_string) {
      count++
    }
    if (count >= 2) {
      return false
    }
  }
  return true
}

const validate_airport = (value, index) => {
  if (!value) return false
  const cities = payload.value.cities
  if (!cities || !cities?.length) return true
  const cities_code = cities.reduce((acc, city) => {
    if (city.dp_airport && city.ar_airport) {
      const key = city.dp_airport.code + '-' + city.ar_airport.code
      acc.push(key)
    }
    return acc
  }, [])
  const current_dp_ar_code =
    cities[index]?.dp_airport?.code + '-' + cities[index]?.ar_airport?.code
  return check_duplicate(cities_code, current_dp_ar_code)
}

// const departure_date = (value, index) => {
//   if (!value) return false
//   const cities = payload.value.cities
//   if (!cities || !cities?.length) return true
//   const previous_date = cities[index - 1]?.dates
//   if (!previous_date) return true
//   return value > previous_date
// }

const emit = defineEmits(['submit'])
const traveler_limits = key_by(props.flight.traveler_limits, 'traveler_type')

const handle_swap_airport = () => {
  const origin = clone_deep(payload.value.dp_airport)
  const destination = clone_deep(payload.value.ar_airport)
  payload.value.ar_airport = origin
  payload.value.dp_airport = destination
}

const handle_add_flight = () => {
  if (payload.value.cities?.length === 5) return
  if (payload.value && payload.value.cities) {
    const prev_leg = payload.value.cities[payload.value.cities.length - 1]

    payload.value.cities = [
      ...payload.value.cities,
      {
        dp_airport: prev_leg?.ar_airport ?? null,
        ar_airport: null,
        dates: null
      }
    ]
    render_key.value += 1
  }
}

const handle_remove_flight = (index) => {
  if (payload.value && payload.value.cities) {
    payload.value.cities = payload.value.cities.filter((city, i) => i !== index)
  }
  render_key.value += 1
}

const validate_airport_select = (place, type) => {
  const dp_airport_id = payload.value.dp_airport?.id ?? ''
  const ar_airport_id = payload.value.ar_airport?.id ?? ''
  if (type === 'dp_airport' && ar_airport_id === place.id) {
    return false
  }
  if (type === 'ar_airport' && dp_airport_id === place.id) {
    return false
  }
  return true
}

const validate_multi_date = (index, date) => {
  const cities = payload.value.cities
  let prev_date = new Date()
  for (let j = index - 1; j >= 0; j--) {
    if (cities[j]?.dates) {
      prev_date = dayjs(cities[j]?.dates)
      break
    }
  }
  return dayjs(date).isAfter(prev_date) || dayjs(date).isSame(prev_date)
}

const handle_update_multi_date = () => {
  const cities = payload.value.cities
  if (!cities || !cities?.length) return
  const pre_dates = cities.map((x) => x.dates) ?? []
  const dates = [...pre_dates]

  for (let i = 1; i < dates.length; i++) {
    let prev_date = null
    for (let j = i - 1; j >= 0; j--) {
      if (dates[j]) {
        prev_date = dayjs(dates[j])
        break
      }
    }
    const current_date = dates[i] ? dayjs(dates[i]) : null
    if (current_date === null) {
      continue
    }
    if (
      prev_date &&
      (!current_date.isValid() ||
        !(current_date.isAfter(prev_date) || current_date.isSame(prev_date)))
    ) {
      dates[i] = prev_date.add(1, 'day').format('YYYY-MM-DD')
    }
  }
  if (JSON.stringify(dates) !== JSON.stringify(pre_dates)) {
    dates.forEach((date, index) => {
      payload.value.cities[index].dates = date
    })
    render_key.value += 1
  }
}

const handle_update_airport = (type, index, data) => {
  if (type === 'ar_airport') {
    const cities = payload.value.cities
    if (cities?.[index + 1] && !cities?.[index + 1]?.dp_airport) {
      payload.value.cities[index + 1].dp_airport = data
      render_key.value += 1
    }
  }
}

const handle_currency_based_departure = async (data, dp_airport_code) => {
  const currency_code = await check_currency_based_departure(
    dp_airport_code,
    context_store
  )
  if (currency_code) {
    data.currency_code = currency_code
    data.disabled_currency = true
  }

  return data
}

const meta = get_meta_default({
  props,
  rules,
  payload,
  place_types: props.place_types,
  traveler_limits,
  handle_swap_airport,
  handle_remove_flight,
  handle_add_flight,
  viewport: context_store.viewport,
  rules_multi_city,
  show_multi_city: props.node.meta.show_multi_city,
  validate_airport: validate_airport_select,
  handle_update_multi_date,
  handle_update_airport,
  validate_multi_date
})

const meta_expedia = get_meta_expedia({
  props,
  rules,
  place_types: props.place_types,
  payload,
  traveler_limits,
  handle_swap_airport
})

const submit = async () => {
  const {
    travelers,
    ar_airport,
    dp_airport,
    cabin_class,
    fl_round_trip,
    fl_multi_city,
    cities,
    dates
  } = payload.value || {}

  let data = {}

  if (fl_multi_city) {
    const citiesObj = cities.reduce((acc, city, index) => {
      if (city.dp_airport && city.ar_airport) {
        const key = city.dp_airport.code + '-' + city.ar_airport.code
        acc[key] = { departure_date: city.dates, index }
      }
      return acc
    }, {})
    const expectation = {
      is_multi_city: true,
      fl_cabin_class: cabin_class,
      legs: citiesObj
    }
    data = {
      process: 'flight',
      currency_code: context_store.currency?.code,
      language_code: context_store.language?.code,
      package_id: props.flight.id,
      travelers: JSON.stringify(travelers),
      expectation: JSON.stringify(expectation)
    }
    package_store.add_selected({
      data,
      key: `flight-legs`,
      created_at: new Date().getTime(),
      payload: {
        type: 'multi_city',
        travelers: travelers.length,
        from: cities[0]?.dp_airport?.name,
        to: cities[cities.length - 1]?.ar_airport.name,
        min_date: cities[0]?.dates,
        dates: `${dayjs(cities[0]?.dates).format('ddd, MMM DD')} - ${dayjs(
          cities[cities.length - 1]?.dates
        ).format('ddd, MMM DD')}`
      }
    })
    data = await handle_currency_based_departure(
      data,
      cities[0].dp_airport.code
    )
  } else {
    let origin_type_dp_airport = 'airport_code',
      origin_type_ar_airport = 'airport_code'

    if (
      [
        'city',
        'multi_city_vicinity',
        'province_state',
        'administrative_area_level_4'
      ].includes(dp_airport?.type)
    ) {
      origin_type_dp_airport = 'city_code'
    }

    if (
      [
        'city',
        'multi_city_vicinity',
        'province_state',
        'administrative_area_level_4'
      ].includes(ar_airport?.type)
    ) {
      origin_type_ar_airport = 'city_code'
    }

    const expectation = {
      is_multi_city: false,
      start_place_code: dp_airport?.code,
      start_place_type: origin_type_dp_airport,
      des_code: ar_airport?.code,
      des_type: origin_type_ar_airport,
      fl_cabin_class: cabin_class,
      fl_departure_date: fl_round_trip ? dates[0] : dates,
      fl_return_date: fl_round_trip ? dates[1] : dates,
      fl_round_trip: fl_round_trip
    }

    data = {
      process: 'flight',
      currency_code: context_store.currency?.code,
      language_code: context_store.language?.code,
      package_id: props.flight.id,
      travelers: JSON.stringify(travelers),
      expectation: JSON.stringify(expectation)
    }
    package_store.add_selected({
      data,
      key: `flight-${expectation.start_place_code}-${expectation.des_code}`,
      created_at: new Date().getTime(),
      payload: {
        from: dp_airport.name,
        to: ar_airport.name,
        dates:
          typeof dates === 'string'
            ? dayjs(dates).format('ddd, MMM DD')
            : dates.map((x) => dayjs(x).format('ddd, MMM DD')).join(' - '),
        travelers: travelers.length,
        type: fl_round_trip ? 'round_trip' : 'one_way',
        min_date: typeof dates === 'string' ? dates : dates[0]
      }
    })
    if (props.flight_campaign) {
      data.flight_campaign = props.flight_campaign
    }
    if (props.partner_id) {
      data.partner_id = props.partner_id
    }
    data = await handle_currency_based_departure(
      data,
      expectation.start_place_code
    )
  }

  emit('submit', data)
}
</script>
