import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import key_by from 'lodash.keyby'
import compact from 'lodash.compact'

import PlaceSelect from 'src/components/common/place-select'
import DatePicker from 'src/components/common/date-picker'
import TravelerSelect from 'src/components/common/traveler-select'
import CabinSelect from 'src/components/common/cabin-select'
import RouteSwitch from 'src/components/common/route-switch'
import BoxField from 'src/components/common/box-field/index.vue'
import FlightGroupField from './multi-city-flight/index.vue'

import SearchBtn from '../search-btn'
import AddFlight from './add-flight/index.vue'

import {
  get_field_settings,
  PACKAGE_FLIGHT_IDS
} from 'src/composables/utils/forms'
import { MOBILE_VIEWPORT } from 'src/constants'
import { isMobile } from 'src/composables/utils/device-detect'

export const get_meta_default = (params) => {
  const { t } = useI18n()
  const {
    props,
    rules,
    payload,
    traveler_limits,
    handle_remove_flight,
    handle_add_flight,
    viewport,
    rules_multi_city,
    show_multi_city = false,
    validate_airport,
    handle_update_airport,
    handle_update_multi_date,
    validate_multi_date
  } = params
  const setting_default = props.setting?.meta?.default?.fields ?? {}
  const field_setting = key_by(setting_default, 'id') ?? {}

  const ar_airport_comp = ref(null)
  const cabin_select_comp = ref(null)
  const date_picker_comp = ref(null)
  const traveler_select_comp = ref(null)
  const multi_flight_group_comp = ref(null)

  const handle_dp_airport_done = () => {
    if(isMobile()) return
    ar_airport_comp.value?.[0]?.open_dialog?.()
  }

  const handle_ar_airport_done = () => {
    if(isMobile()) return
    date_picker_comp.value?.[0]?.open_dialog?.()
  }

  const handle_traveler_select_done = () => {
    if(isMobile()) return
    cabin_select_comp.value?.[0]?.open_dialog?.()
  }

  const handle_date_picker_done = () => {
    if(isMobile()) return
    if(field_setting?.[PACKAGE_FLIGHT_IDS.TRAVELERS]?.disabled) return 
    traveler_select_comp.value?.[0]?.open_dialog?.()
  }

  const handle_cabin_select_done = () => {
    if(isMobile()) return
    const first_flight_group = multi_flight_group_comp.value?.find(
      (x) => x.index === 0
    )
    first_flight_group?.open_dialog?.()
  }

  const handle_flight_group_done = (index) => {
    if(isMobile()) return
    const next_flight_group = multi_flight_group_comp.value?.find(
      (x) => x.index === index + 1
    )
    next_flight_group?.open_dialog?.()
  }

  const generate_flight_groups = () => {
    if (!payload.value.fl_multi_city || !payload.value.cities) return []
    return payload.value?.cities?.map?.((_item, index) => {
      return {
        id: PACKAGE_FLIGHT_IDS.CITIES,
        component: FlightGroupField,
        model: 'payload',
        order: 6,
        ref: multi_flight_group_comp,
        bind: {
          rules: rules_multi_city(index),
          index,
          color: props.color,
          place_types: props.place_types,
          product: props.product,
          flight: props.flight,
          handle_update_airport,
          handle_update_date: handle_update_multi_date,
          validate_date: validate_multi_date,
          payload,
          direction:
            field_setting?.[PACKAGE_FLIGHT_IDS.CITIES]?.direction ??
            (viewport === MOBILE_VIEWPORT ? 'column' : 'row')
        },
        events: {
          remove_flight: handle_remove_flight,
          done: () => handle_flight_group_done(index)
        },
        ...get_field_settings({
          field_id: PACKAGE_FLIGHT_IDS.CITIES,
          settings: field_setting,
          default_values: {
            order: {
              desktop: 6,
              tablet: 6,
              mobile: 6
            },
            dimension: {
              columns: {
                desktop: 12,
                tablet: 12,
                mobile: 12
              }
            }
          }
        })
      }
    })
  }

  return computed(() => ({
    fields: compact([
      {
        id: PACKAGE_FLIGHT_IDS.ROUND_TRIP,
        component: RouteSwitch,
        style: {
          color: props.color
        },
        bind: {
          color: props.color,
          round_trip: 'fl_round_trip',
          multi_city: 'fl_multi_city',
          show_multi_city: show_multi_city
            ? field_setting?.[PACKAGE_FLIGHT_IDS.ROUND_TRIP]
                ?.hidden_multi_city !== false
            : false,
          payload
        },
        order: 1,
        events: {
         
        },
        model: 'fl_round_trip',
        ...get_field_settings({
          field_id: PACKAGE_FLIGHT_IDS.ROUND_TRIP,
          settings: field_setting,
          default_values: {
            order: {
              desktop: 1,
              tablet: 1,
              mobile: 1
            },
            dimension: {
              columns: {
                desktop: 12,
                tablet: 12,
                mobile: 12
              }
            }
          }
        })
      },
      !payload.value.fl_multi_city && {
        id: PACKAGE_FLIGHT_IDS.AIRPORT,
        component: PlaceSelect,
        model: 'dp_airport',
        order: 2,
        events: {
          done: handle_dp_airport_done
        },
        bind: {
          dense: true,
          cities_with_airports: true,
          types: props.place_types,
          rules: rules.dp_airport,
          outlined: true,
          'hide-bottom-space': true,
          'hide-selected': true,
          'fill-input': true,
          static_route_enabled: props.product.static_route_enabled,
          destination_type: props.product.static_route_enabled
            ? 'departure'
            : '',
          prepend_icon: 'flight_takeoff',
          arrival_code:
            props.product.static_route_enabled && payload.ar_airport
              ? payload.value.ar_airport.code
              : '',
          has_code: true,
          label: t('common.origin'),
          validate: (item) => validate_airport(item, 'dp_airport')
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_FLIGHT_IDS.AIRPORT,
          settings: field_setting,
          default_values: {
            order: {
              desktop: 2,
              tablet: 2,
              mobile: 2
            },
            dimension: {
              columns: {
                desktop: 4,
                tablet: 6,
                mobile: 12
              }
            }
          }
        })
      },
      !payload.value.fl_multi_city && {
        id: PACKAGE_FLIGHT_IDS.DESTINATION,
        component: PlaceSelect,
        model: 'ar_airport',
        order: 3,
        events: {
          done: handle_ar_airport_done
        },
        ref: ar_airport_comp,
        bind: {
          key: JSON.stringify(payload.value.ar_airport),
          dense: true,
          cities_with_airports: true,
          types: props.place_types,
          rules: rules.ar_airport,
          outlined: true,
          'hide-bottom-space': true,
          'hide-selected': true,
          'fill-input': true,
          static_route_enabled: props.product.static_route_enabled,
          destination_type: props.product.static_route_enabled ? 'arrival' : '',
          prepend_icon: 'place',
          departure_code:
            props.product.static_route_enabled && payload.value.dp_airport
              ? payload.value.dp_airport.code
              : '',
          has_code: true,
          label: t('common.destination'),
          validate: (item) => validate_airport(item, 'ar_airport')
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_FLIGHT_IDS.DESTINATION,
          settings: field_setting,
          default_values: {
            disabled: !!props?.default_destination?.id,
            order: {
              desktop: 3,
              tablet: 3,
              mobile: 3
            },
            dimension: {
              columns: {
                desktop: 4,
                tablet: 6,
                mobile: 12
              }
            }
          }
        })
      },
      !payload.value.fl_multi_city && {
        id: PACKAGE_FLIGHT_IDS.DATES,
        component: DatePicker,
        model: 'dates',
        order: 4,
        events: {
          done: handle_date_picker_done
        },
        ref: date_picker_comp,
        bind: {
          dense: true,
          outlined: true,
          'hide-bottom-space': true,
          booking_cutoff_days: props.flight.booking_cutoff_days,
          range: payload.value.fl_round_trip,
          rules: rules.dates,
          label: payload.value.fl_round_trip
            ? t('common.departure-return')
            : t('common.departure'),
          color: props.color,
          enable_only: field_setting?.[PACKAGE_FLIGHT_IDS.DATES]?.enable_only
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_FLIGHT_IDS.DATES,
          settings: field_setting,
          default_values: {
            order: {
              desktop: 4,
              tablet: 4,
              mobile: 4
            },
            dimension: {
              columns: {
                desktop: 4,
                tablet: 6,
                mobile: 12
              }
            }
          }
        })
      },
      {
        id: PACKAGE_FLIGHT_IDS.TRAVELERS,
        component: TravelerSelect,
        model: 'travelers',
        order: 5,
        events: {
          done: handle_traveler_select_done
        },
        ref: traveler_select_comp,
        bind: {
          dense: true,
          outlined: true,
          'hide-bottom-space': true,
          rules: rules.travelers,
          max_adults: Number(traveler_limits?.['adult']?.limit),
          max_infants: Number(traveler_limits?.['infant']?.limit),
          max_children: Number(traveler_limits?.['child']?.limit),
          traveler_limit_type: props.flight.traveler_limit_type,
          traveler_type_limits: props.flight.traveler_type_limits,
          total_traveler_limit: props.flight.total_traveler_limit,
          default_traveler_count: props.flight.default_traveler_count,
          traveler_types: props.product.traveler_types,
          label: t('common.travelers'),
          color: props.color
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_FLIGHT_IDS.TRAVELERS,
          settings: field_setting,
          default_values: {
            order: {
              desktop: 5,
              tablet: 5,
              mobile: 5
            },
            dimension: {
              columns: {
                desktop: 4,
                tablet: 6,
                mobile: 12
              }
            }
          }
        })
      },
      {
        id: PACKAGE_FLIGHT_IDS.CABIN_CLASS,
        component: CabinSelect,
        model: 'cabin_class',
        order: 6,
        ref: cabin_select_comp,
        events: {
          done: handle_cabin_select_done
        },
        bind: {
          dense: true,
          rules: rules.cabin_class,
          outlined: true,
          'hide-bottom-space': true,
          emit_value: true,
          map_options: true,
          cabin_classes: props.product.cabin_classes,
          prepend_icon: 'class',
          label: t('common.cabin-class'),
          color: props.color
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_FLIGHT_IDS.CABIN_CLASS,
          settings: field_setting,
          default_values: {
            order: {
              desktop: 6,
              tablet: 6,
              mobile: 6
            },
            dimension: {
              columns: {
                desktop: 4,
                tablet: 6,
                mobile: 12
              }
            }
          }
        })
      },
      payload.value.fl_multi_city && {
        id: PACKAGE_FLIGHT_IDS.CITIES_BOX1,
        component: BoxField,
        model: 'box1',
        order: 6,
        events: {},
        ...get_field_settings({
          field_id: PACKAGE_FLIGHT_IDS.CITIES_BOX1,
          settings: field_setting,
          default_values: {
            order: {
              desktop: 6,
              tablet: 6,
              mobile: 6
            },
            dimension: {
              columns: {
                desktop: 4,
                tablet: 0,
                mobile: 0
              }
            }
          }
        })
      },
      ...generate_flight_groups(),
      payload.value.fl_multi_city && {
        id: PACKAGE_FLIGHT_IDS.ADD_FLIGHT_BTN,
        component: AddFlight,
        model: 'payload',
        order: 6,
        events: {
          add_flight: handle_add_flight
        },
        bind: {
          disabled: payload.value.cities?.length >= 5
        },
        ...get_field_settings({
          field_id: PACKAGE_FLIGHT_IDS.ADD_FLIGHT_BTN,
          settings: field_setting,
          default_values: {
            order: {
              desktop: 8,
              tablet: 8,
              mobile: 8
            },
            dimension: {
              columns: {
                desktop: 8,
                tablet: 12,
                mobile: 12
              }
            }
          }
        })
      },
      {
        id: PACKAGE_FLIGHT_IDS.SEARCH_BTN,
        component: SearchBtn,
        model: 'payload',
        order: 7,
        events: {},
        bind: {
          label: t('common.search-now'),
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_FLIGHT_IDS.SEARCH_BTN,
          settings: field_setting,
          default_values: {
            order: {
              desktop: 9,
              tablet: 9,
              mobile: 9
            },
            dimension: {
              columns: {
                desktop: 4,
                tablet: 6,
                mobile: 12
              }
            }
          }
        })
      }
    ])
  }))
}
