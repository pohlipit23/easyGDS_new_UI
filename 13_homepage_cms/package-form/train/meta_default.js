import { computed , ref} from 'vue'
import { useI18n } from 'vue-i18n'
import key_by from 'lodash.keyby'

import DatePicker from 'src/components/common/date-picker'
import TravelerSelect from 'src/components/common/traveler-select'
import AirportPicker from 'src/components/common/airport-picker'
import RouteSwitch from 'src/components/common/route-switch'
import SearchBtn from '../search-btn'

import {
  get_field_settings,
  PACKAGE_TRAIN_IDS
} from 'src/composables/utils/forms'
import { isMobile } from 'src/composables/utils/device-detect'

export const get_meta_default = (params) => {
  const { t } = useI18n()
  const {
    props,
    rules,
    place_types,
    payload,
    traveler_limits,
    handle_swap_airport,
    handle_validate_place,
    group_booking_travelers,
    handle_change_group_booking,
    group_booking,
    is_show_group_booking_toggle
  } = params
  const setting_default = props.setting?.meta?.default?.fields ?? {}
  const field_setting = key_by(setting_default, 'id') ?? {}

  const date_picker_comp = ref(null)
  const traveler_select_comp = ref(null)

  const handle_airport_done = () => {
    if(isMobile()) return
    if(field_setting?.[PACKAGE_TRAIN_IDS.DATES]?.disabled) return
    date_picker_comp.value?.[0].open_dialog?.()
  }

  const handle_date_done = () => {
    if(isMobile()) return
    if(field_setting?.[PACKAGE_TRAIN_IDS.TRAVELERS]?.disabled) return
    traveler_select_comp.value?.[0].open_dialog?.()
  }

  return computed(() => ({
    fields: [
      {
        id: PACKAGE_TRAIN_IDS.ROUND_TRIP,
        component: RouteSwitch,
        style: {
          color: props.color
        },
        bind: {
          payload,
          color: props.color,
          round_trip: 'tn_round_trip',
          multi_city: 'tn_multi_city'
        },
        order: 1,
        events: {},
        model: 'tn_round_trip',
        ...get_field_settings({
          field_id: PACKAGE_TRAIN_IDS.ROUND_TRIP,
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
      {
        id: PACKAGE_TRAIN_IDS.AIRPORT,
        component: AirportPicker,
        model: 'payload',
        order: 2,
        events: {
          handle_swap_airport,
          done: handle_airport_done
        },
        bind: {
          product: props.product,
          color: props.color,
          has_code: true,
          cities_with_airports: false,
          place_types,
          rules,
          direction: field_setting?.[PACKAGE_TRAIN_IDS.AIRPORT]?.direction,
          validate: handle_validate_place,
          is_fetch_when_focus: true,
          disabled_destination: !!props?.default_destination?.id
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_TRAIN_IDS.AIRPORT,
          settings: field_setting,
          default_values: {
            order: {
              desktop: 2,
              tablet: 2,
              mobile: 2
            },
            dimension: {
              columns: {
                desktop: 5,
                tablet: 12,
                mobile: 12
              }
            }
          }
        })
      },
      {
        id: PACKAGE_TRAIN_IDS.DATES,
        component: DatePicker,
        model: 'dates',
        order: 3,
        ref: date_picker_comp,
        events: {
          done: handle_date_done
        },
        bind: {
          dense: true,
          outlined: true,
          'hide-bottom-space': true,
          booking_cutoff_days: props.train?.booking_cutoff_days,
          range: payload.value.tn_round_trip,
          rules: rules.dates,
          label: payload.value.tn_round_trip
            ? t('common.departure-return')
            : t('common.departure'),
          enable_only: field_setting?.[PACKAGE_TRAIN_IDS.DATES]?.enable_only,
          color: props.color
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_TRAIN_IDS.DATES,
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
        id: PACKAGE_TRAIN_IDS.TRAVELERS,
        component: TravelerSelect,
        model: 'travelers',
        order: 4,
        ref: traveler_select_comp,
        events: {
          on_change_group_booking: handle_change_group_booking
        },
        bind: {
          dense: true,
          outlined: true,
          'hide-bottom-space': true,
          rules: rules.travelers,
          max_adults: Number(traveler_limits?.['adult']?.limit),
          max_infants: Number(traveler_limits?.['infant']?.limit),
          max_children: Number(traveler_limits?.['child']?.limit),
          traveler_limit_type: props.train?.traveler_limit_type,
          traveler_type_limits: props.train?.traveler_type_limits,
          total_traveler_limit: props.train?.total_traveler_limit,
          default_traveler_count: props.train?.default_traveler_count,
          traveler_types: props.product.traveler_types,
          label: t('common.travelers'),
          min_passengers: 11,
          max_passengers: 99,
          is_show_group_booking_toggle,
          group_booking_travelers,
          group_booking,
          color: props.color
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_TRAIN_IDS.TRAVELERS,
          settings: field_setting,
          default_values: {
            order: {
              desktop: 4,
              tablet: 4,
              mobile: 4
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
        id: PACKAGE_TRAIN_IDS.SEARCH_BTN,
        component: SearchBtn,
        model: 'payload',
        order: 5,
        events: {},
        bind: {
          label: t('common.search'),
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_TRAIN_IDS.SEARCH_BTN,
          settings: field_setting,
          default_values: {
            order: {
              desktop: 5,
              tablet: 5,
              mobile: 5
            },
            dimension: {
              columns: {
                desktop: 1,
                tablet: 12,
                mobile: 12
              }
            }
          }
        })
      }
    ]
  }))
}
