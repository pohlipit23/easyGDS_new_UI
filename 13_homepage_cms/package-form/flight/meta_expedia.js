import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import DatePicker from 'src/components/common/date-picker'
import TravelerSelect from 'src/components/common/traveler-select'
import CabinSelect from 'src/components/common/cabin-select'
import RouteSwitch from 'src/components/common/route-switch'
import BoxField from 'src/components/common/box-field'
import AirportPicker from 'src/components/common/airport-picker'
import SearchBtn from '../search-btn'

import {
  PACKAGE_FLIGHT_IDS,
  get_field_settings
} from 'src/composables/utils/forms'
import { isMobile } from 'src/composables/utils/device-detect'

export const get_meta_expedia = (params) => {
  const { t } = useI18n()
  const {
    props,
    rules,
    payload,
    traveler_limits,
    handle_swap_airport,
    show_multi_city
  } = params
  const setting_expedia = props.setting?.meta?.expedia?.fields ?? {}

  const airport_picker_comp = ref(null)
  const date_picker_comp = ref(null)
  const traveler_select_comp = ref(null)

  const handle_cabin_select_done = () => {
    if (isMobile()) return
    airport_picker_comp.value?.[0]?.open_dialog?.()
  }

  const handle_airport_picker_done = () => {
    if (isMobile()) return
    date_picker_comp.value?.[0]?.open_dialog?.()
  }

  const handle_date_picker_done = () => {
    if (isMobile()) return
    if(setting_expedia?.[PACKAGE_FLIGHT_IDS.TRAVELERS]?.disabled) return
    traveler_select_comp.value?.[0]?.open_dialog?.()
  }

  return computed(() => ({
    fields: [
      {
        id: PACKAGE_FLIGHT_IDS.ROUND_TRIP,
        order: 1,
        events: {},
        component: RouteSwitch,
        style: {
          display: 'flex',
          desktop: {
            color: props.color,
            display: 'flex',
            'margin-right': '20px'
          }
        },
        bind: {
          type: 'tabs',
          color: props.color,
          round_trip: 'fl_round_trip',
          payload,
          show_multi_city
        },
        model: 'fl_round_trip',
        ...get_field_settings({
          field_id: PACKAGE_FLIGHT_IDS.ROUND_TRIP,
          settings: setting_expedia,
          default_values: {
            order: {
              desktop: 1,
              tablet: 1,
              mobile: 1
            },
            dimension: {
              columns: {
                desktop: 2,
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
        order: 2,
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
          label: t('common.cabin-class'),
          hide_label_mode: true,
          rounded: true,
          color: props.color
        },
        style: {
          color: props.color,
          display: 'flex'
        },
        ...get_field_settings({
          field_id: PACKAGE_FLIGHT_IDS.CABIN_CLASS,
          settings: setting_expedia,
          default_values: {
            order: {
              desktop: 2,
              tablet: 2,
              mobile: 2
            },
            dimension: {
              columns: {
                desktop: 3,
                tablet: 6,
                mobile: 12
              }
            }
          }
        })
      },
      {
        id: PACKAGE_FLIGHT_IDS.BOX1,
        component: BoxField,
        model: 'box1',
        order: 3,
        events: {},
        ...get_field_settings({
          field_id: PACKAGE_FLIGHT_IDS.BOX1,
          settings: setting_expedia,
          default_values: {
            order: {
              desktop: 3,
              tablet: 3,
              mobile: 3
            },
            dimension: {
              columns: {
                desktop: 6,
                tablet: 0,
                mobile: 0
              }
            }
          }
        })
      },
      {
        id: PACKAGE_FLIGHT_IDS.AIRPORT,
        component: AirportPicker,
        model: 'payload',
        order: 4,
        ref: airport_picker_comp,
        events: {
          handle_swap_airport,
          done: handle_airport_picker_done
        },
        bind: {
          product: props.product,
          color: props.color,
          has_code: true,
          rules
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_FLIGHT_IDS.AIRPORT,
          settings: setting_expedia,
          default_values: {
            order: {
              desktop: 4,
              tablet: 4,
              mobile: 4
            },
            dimension: {
              columns: {
                desktop: 5,
                tablet: 6,
                mobile: 12
              }
            }
          }
        })
      },
      {
        id: PACKAGE_FLIGHT_IDS.DATES,
        component: DatePicker,
        model: 'dates',
        order: 5,
        ref: date_picker_comp,
        events: {
          done: handle_date_picker_done
        },
        bind: {
          dense: true,
          outlined: true,
          'hide-bottom-space': true,
          booking_cutoff_days: props.flight.booking_cutoff_days,
          range: payload.value.fl_round_trip,
          rules: rules.dates,
          color: props.color,
          label: payload.value.fl_round_trip
            ? t('common.departure-return')
            : t('common.departure'),
          enable_only: setting_expedia?.[PACKAGE_FLIGHT_IDS.DATES]?.enable_only
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_FLIGHT_IDS.DATES,
          settings: setting_expedia,
          default_values: {
            order: {
              desktop: 5,
              tablet: 5,
              mobile: 5
            },
            dimension: {
              columns: {
                desktop: 3,
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
        ref: traveler_select_comp,
        events: {},
        bind: {
          dense: true,
          outlined: true,
          'hide-bottom-space': true,
          rules: rules.travelers,
          max_adults: Number(traveler_limits?.['adult']?.limit),
          max_infants: Number(traveler_limits?.['infant']?.limit),
          max_children: Number(traveler_limits?.['child']?.limit),
          traveler_limit_type: props.flight.traveler_limit_type,
          traveler_type_limits: props.flight?.traveler_type_limits,
          total_traveler_limit: props.flight.total_traveler_limit,
          default_traveler_count: props.flight.default_traveler_count,
          traveler_types: props.product.traveler_types,
          color: props.color,
          label: t('common.travelers')
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_FLIGHT_IDS.TRAVELERS,
          settings: setting_expedia,
          default_values: {
            order: {
              desktop: 6,
              tablet: 6,
              mobile: 6
            },
            dimension: {
              columns: {
                desktop: 3,
                tablet: 6,
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
          label: t('common.search'),
          rounded: true,
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_FLIGHT_IDS.SEARCH_BTN,
          settings: setting_expedia,
          default_values: {
            order: {
              desktop: 7,
              tablet: 7,
              mobile: 7
            },
            dimension: {
              columns: {
                desktop: 1,
                tablet: 6,
                mobile: 12
              }
            }
          }
        })
      }
    ]
  }))
}
