import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import key_by from 'lodash.keyby'
import compact from 'lodash.compact'

import PlaceSelect from 'src/components/common/place-select'
import DatePicker from 'src/components/common/date-picker'
import TravelerSelect from 'src/components/common/traveler-select'
import SearchBtn from '../search-btn'

import {
  get_field_settings,
  PACKAGE_BUNDLE_IDS
} from 'src/composables/utils/forms'
import CabinSelect from 'src/components/common/cabin-select/index.vue'
import SeparateCheckInput from 'src/components/common/package-form/bundle/separate-check-input/index.vue'
import { isMobile } from 'src/composables/utils/device-detect'

export const get_meta_default = (params) => {
  const { t } = useI18n()
  const {
    props,
    rules,
    traveler_limits,
    date_format,
    payload,
    validate_airport,
    hide_separate_dates
  } = params
  const setting_default = props.setting?.meta?.default?.fields ?? {}
  const field_setting = key_by(setting_default, 'id') ?? {}

  const ar_airport_comp = ref(null)
  const date_picker_comp = ref(null)
  const traveler_select_comp = ref(null)
  const cabin_select_comp = ref(null)
  const separate_check_input_comp = ref(null)
  const handle_dp_airport_done = () => {
    if (isMobile()) return
    ar_airport_comp.value?.[0]?.open_dialog?.()
  }

  const handle_ar_airport_done = () => {
    if (isMobile()) return
    date_picker_comp.value?.[0]?.open_dialog?.()
  }

  const handle_date_picker_done = () => {
    if (isMobile()) return
    if(field_setting?.[PACKAGE_BUNDLE_IDS.TRAVELERS]?.disabled) return
    traveler_select_comp.value?.[0]?.open_dialog?.()
  }

  const handle_traveler_select_done = () => {
    if (isMobile()) return
    cabin_select_comp.value?.[0]?.open_dialog?.()
  }

  const handle_cabin_select_done = () => {
    if (isMobile()) return
    separate_check_input_comp.value?.[0]?.open_dialog?.()
  }

  return computed(() => ({
    fields: compact([
      {
        id: PACKAGE_BUNDLE_IDS.DP_AIRPORT,
        component: PlaceSelect,
        hidden: false,
        model: 'dp_airport',
        order: 1,
        events: {
          done: handle_dp_airport_done
        },
        bind: {
          city_code: true,
          cities_with_airports: true,
          dense: true,
          types: props.place_types,
          rules: rules.dp_airport,
          outlined: true,
          'hide-bottom-space': true,
          'fill-input': true,
          'hide-selected': true,
          static_route_enabled: props.product.static_route_enabled,
          destination_type: props.product.static_route_enabled
            ? 'departure'
            : '',
          prepend_icon: 'flight_takeoff',
          arrival_code:
            props.product.static_route_enabled && payload.value.ar_airport
              ? payload.value.ar_airport.code
              : '',
          label: t('common.origin'),
          has_code: true,
          validate: (item) => validate_airport(item, 'dp_airport')
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_BUNDLE_IDS.DP_AIRPORT,
          settings: field_setting,
          default_values: {
            order: {
              desktop: 1,
              tablet: 1,
              mobile: 1
            },
            dimension: {
              columns: {
                desktop: 3,
                tablet: 12,
                mobile: 12
              }
            }
          }
        })
      },
      {
        id: PACKAGE_BUNDLE_IDS.AR_AIRPORT,
        component: PlaceSelect,
        hidden: false,
        model: 'ar_airport',
        ref: ar_airport_comp,
        order: 2,
        events: {
          done: handle_ar_airport_done
        },
        bind: {
          city_code: true,
          cities_with_airports: true,
          with_properties: true,
          hotel_places: true,
          dense: true,
          types: [...props.place_types, 'administrative_area_level_4'],
          rules: rules.ar_airport,
          outlined: true,
          'hide-bottom-space': true,
          'fill-input': true,
          'hide-selected': true,
          static_route_enabled: props.product.static_route_enabled,
          destination_type: props.product.static_route_enabled ? 'arrival' : '',
          prepend_icon: 'place',
          arrival_code:
            props.product.static_route_enabled && payload.value.dp_airport
              ? payload.value.dp_airport.code
              : '',
          label: t('common.destination'),
          include_properties: true,
          has_code: true,
          validate: (item) => validate_airport(item, 'ar_airport')
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_BUNDLE_IDS.AR_AIRPORT,
          settings: field_setting,
          default_values: {
            disabled: !!props?.default_destination?.id,
            order: {
              desktop: 2,
              tablet: 2,
              mobile: 2
            },
            dimension: {
              columns: {
                desktop: 3,
                tablet: 12,
                mobile: 12
              }
            }
          }
        })
      },
      {
        id: PACKAGE_BUNDLE_IDS.FLIGHT_DATES,
        component: DatePicker,
        hidden: false,
        model: 'flight_dates',
        order: 3,
        ref: date_picker_comp,
        events: {
          done: handle_date_picker_done
        },
        bind: {
          range: true,
          dense: true,
          outlined: true,
          'hide-bottom-space': true,
          date_format,
          booking_cutoff_days: props.bundle.booking_cutoff_days,
          label: t('common.departure-return'),
          rules: rules.flight_dates,
          color: props.color,
          disabled_samedates: true,
          enable_only:
            setting_default?.[PACKAGE_BUNDLE_IDS.FLIGHT_DATES]?.enable_only
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_BUNDLE_IDS.FLIGHT_DATES,
          settings: field_setting,
          default_values: {
            order: {
              desktop: 3,
              tablet: 3,
              mobile: 3
            },
            dimension: {
              columns: {
                desktop: 3,
                tablet: 12,
                mobile: 12
              }
            }
          }
        })
      },
      {
        id: PACKAGE_BUNDLE_IDS.SEARCH_BTN,
        component: SearchBtn,
        hidden: false,
        model: 'payload',
        order: 4,
        events: {},
        bind: {
          label: t('common.search-now'),
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_BUNDLE_IDS.SEARCH_BTN,
          settings: field_setting,
          default_values: {
            order: {
              desktop: 4,
              tablet: 10,
              mobile: 10
            },
            dimension: {
              columns: {
                desktop: 3,
                tablet: 12,
                mobile: 12
              }
            }
          }
        })
      },
      {
        id: PACKAGE_BUNDLE_IDS.TRAVELERS,
        component: TravelerSelect,
        hidden: false,
        model: 'travelers',
        order: 5,
        ref: traveler_select_comp,
        events: {
          done: handle_traveler_select_done
        },
        bind: {
          dense: true,
          rules: rules.travelers,
          outlined: true,
          'hide-bottom-space': true,
          with_rooms: true,
          max_rooms: 3,
          max_adults: +traveler_limits?.['adult']?.limit,
          max_infants: +traveler_limits?.['infant']?.limit,
          max_children: +traveler_limits?.['child']?.limit,
          traveler_limit_type: props.bundle?.traveler_limit_type,
          traveler_type_limits: props.bundle?.traveler_type_limits,
          total_traveler_limit: props.bundle?.total_traveler_limit,
          traveler_types: props.product.traveler_types,
          default_traveler_count: props.bundle.default_traveler_count,
          label: t('common.travelers'),
          color: props.color
        },
        style: {
          color: props.color
        },

        ...get_field_settings({
          field_id: PACKAGE_BUNDLE_IDS.TRAVELERS,
          settings: field_setting,
          default_values: {
            order: {
              desktop: 5,
              tablet: 5,
              mobile: 5
            },
            dimension: {
              columns: {
                desktop: 3,
                tablet: 12,
                mobile: 12
              }
            }
          }
        })
      },
      {
        id: PACKAGE_BUNDLE_IDS.CABIN_CLASS,
        component: CabinSelect,
        hidden: false,
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
          cabin_classes: props.product.cabin_classes,
          'emit-value': true,
          'map-options': true,
          prepend_icon: 'class',
          label: t('common.cabin-class'),
          color: props.color,
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_BUNDLE_IDS.CABIN_CLASS,
          settings: field_setting,
          default_values: {
            order: {
              desktop: 6,
              tablet: 6,
              mobile: 6
            },
            dimension: {
              columns: {
                desktop: 3,
                tablet: 12,
                mobile: 12
              }
            }
          }
        })
      },
      !hide_separate_dates && {
        id: PACKAGE_BUNDLE_IDS.HOTEL_DATES,
        component: SeparateCheckInput,
        ref: separate_check_input_comp,
        hidden: false,
        model: 'form_data',
        model_path: 'separate',
        order: 7,
        events: {},
        bind: {
          dense: true,
          disabled: !payload.value.flight_dates?.[0],
          flight_dates: payload.value.flight_dates,
          date_format,
          hotel_dates: payload.value.hotel_dates,
          color: props.color,
          enable_only:
            setting_default?.[PACKAGE_BUNDLE_IDS.FLIGHT_DATES]?.enable_only
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_BUNDLE_IDS.HOTEL_DATES,
          settings: field_setting,
          default_values: {
            order: {
              desktop: 7,
              tablet: 7,
              mobile: 7
            },
            dimension: {
              columns: {
                desktop: 3,
                tablet: 12,
                mobile: 12
              }
            }
          }
        })
      }
    ])
  }))
}
