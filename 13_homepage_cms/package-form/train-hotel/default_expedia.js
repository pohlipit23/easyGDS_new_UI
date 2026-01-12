import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import DatePicker from 'src/components/common/date-picker'
import TravelerSelect from 'src/components/common/traveler-select'
import StarSelect from 'src/components/common/star-select/index.vue'
import AirportPicker from 'src/components/common/airport-picker/index.vue'
import SeparateCheckInput from './separate-check-inout/index.vue'
import SearchBtn from '../search-btn'

import { get_field_settings, PACKAGE_TRAIN_HOTEL_IDS } from 'src/composables/utils/forms'
import { isMobile } from 'src/composables/utils/device-detect'

export const get_default_expedia = (params) => {
  const { t } = useI18n()
  const { props, rules, traveler_limits, date_format, handle_swap_airport, payload , handle_validate_place} = params
  const settings = props.setting?.meta?.default?.fields ?? {}

  const date_picker_comp = ref(null)
  const traveler_select_comp = ref(null)
  const star_select_comp = ref(null)
  const separate_check_input_comp = ref(null)

  const handle_airport_done = () => {
    if(isMobile()) return
    date_picker_comp.value?.[0].open_dialog?.()
  }

  const handle_date_done = () => {
    if(isMobile()) return
    if(settings?.[PACKAGE_TRAIN_HOTEL_IDS.TRAVELERS]?.disabled) return
    traveler_select_comp.value?.[0].open_dialog?.()
  }

  const handle_traveler_done = () => {
    if(isMobile()) return
    star_select_comp.value?.[0].open_dialog?.()
  }

  const handle_star_done = () => {
    if(isMobile()) return 
    separate_check_input_comp.value?.[0].open_dialog?.()
  }

  return computed(() => ({
    fields: [
      {
        id: PACKAGE_TRAIN_HOTEL_IDS.ORIGIN,
        component: AirportPicker,
        hidden: false,
        model: 'payload',
        order: 1,
        bind: {
          rules,
          product: props.product,
          color: props.color,
          has_code: true,
          cities_with_airports: false,
          direction: settings?.[PACKAGE_TRAIN_HOTEL_IDS.ORIGIN]?.direction,
          place_types: props.place_types,
          validate: handle_validate_place,
          is_fetch_when_focus: true,
          disabled_destination: !!props?.default_destination?.id
        },
        events: {
          handle_swap_airport,
          done: handle_airport_done
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_TRAIN_HOTEL_IDS.ORIGIN,
          settings: settings,
          default_values: {
            order: {
              desktop: 1,
              tablet: 1,
              mobile: 1
            },
            dimension: {
              columns: {
                desktop: 6,
                tablet: 6,
                mobile: 12
              }
            }
          }
        })
      },
      {
        id: PACKAGE_TRAIN_HOTEL_IDS.FLIGHT_DATES,
        component: DatePicker,
        hidden: false,
        model: 'train_dates',
        order: 2,
        ref: date_picker_comp,
        bind: {
          range: true,
          dense: true,
          outlined: true,
          'hide-bottom-space': true,
          rules: rules.dates,
          date_format,
          booking_cutoff_days: 0,
          label: t('common.dates'),
          enable_only:
            settings?.[PACKAGE_TRAIN_HOTEL_IDS.FLIGHT_DATES]?.enable_only,
          disabled_samedates: true,
          color: props.color
        },
        events: {
          handle_swap_airport,
          done: handle_date_done
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_TRAIN_HOTEL_IDS.FLIGHT_DATES,
          settings: settings,
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
        id: PACKAGE_TRAIN_HOTEL_IDS.SEARCH_BTN,
        component: SearchBtn,
        hidden: false,
        model: 'payload',
        order: 3,
        events: {},
        bind: {
          label: t('common.search-now'),
          color: props.color,
          rounded: false
        },
        ...get_field_settings({
          field_id: PACKAGE_TRAIN_HOTEL_IDS.SEARCH_BTN,
          settings: settings,
          default_values: {
            order: {
              desktop: 3,
              tablet: 3,
              mobile: 9
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
        id: PACKAGE_TRAIN_HOTEL_IDS.TRAVELERS,
        component: TravelerSelect,
        hidden: false,
        model: 'travelers',
        order: 4,
        ref: traveler_select_comp,
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
          traveler_limit_type: props.package?.traveler_limit_type,
          traveler_type_limits: props.package?.traveler_type_limits,
          total_traveler_limit: props.package?.total_traveler_limit,
          traveler_types: props.product.traveler_types,
          default_traveler_count: props.package.default_traveler_count,
          label: t('common.travelers'),
          color: props.color
        },
        events: {
          handle_swap_airport,
          done: handle_traveler_done
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_TRAIN_HOTEL_IDS.TRAVELERS,
          settings: settings,
          default_values: {
            order: {
              desktop: 4,
              tablet: 4,
              mobile: 4
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
        id: PACKAGE_TRAIN_HOTEL_IDS.STARS,
        component: StarSelect,
        hidden: false,
        model: 'stars',
        order: 5,
        ref: star_select_comp,
        events: {
          done: handle_star_done
        },
        bind: {
          dense: true,
          outlined: true,
          'hide-bottom-space': true,
          'emit-value': true,
          'map-options': true,
          label: t('common.hotel-stars'),
          hide_label_mode: true,
          rounded: false,
          show_icon: true,
          show_label: true
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_TRAIN_HOTEL_IDS.STARS,
          settings: settings,
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
        id: PACKAGE_TRAIN_HOTEL_IDS.HOTEL_DATES,
        component: SeparateCheckInput,
        hidden: false,
        model: 'form_data',
        model_path: 'separate',
        order: 7,
        ref: separate_check_input_comp,
        events: {},
        bind: {
          dense: true,
          date_format,
          flight_dates: payload.value.train_dates,
          hotel_dates: payload.value.hotel_dates,
          display_format: 'DD/MM/YYYY'
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_TRAIN_HOTEL_IDS.HOTEL_DATES,
          settings: settings,
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
      }
    ]
  }))
}
