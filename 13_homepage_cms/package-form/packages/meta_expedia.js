import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import DatePicker from 'src/components/common/date-picker'
import TravelerSelect from 'src/components/common/traveler-select'
import SearchBtn from '../search-btn'
import CabinSelect from 'src/components/common/cabin-select/index.vue'
import StarSelect from 'src/components/common/star-select/index.vue'
import BoxField from 'src/components/common/box-field/index.vue'
import AirportPicker from 'src/components/common/airport-picker/index.vue'
import {
  get_field_settings,
  PACKAGE_BUNDLE_IDS
} from 'src/composables/utils/forms'
import { isMobile } from 'src/composables/utils/device-detect'

export const get_meta_expedia = (params) => {
  const { t } = useI18n()
  const { props, rules, traveler_limits, date_format, handle_swap_airport } =
    params
  const setting_expedia = props.setting?.meta?.expedia?.fields ?? {}

  const star_select_comp = ref(null)
  const airport_picker_comp = ref(null)
  const date_picker_comp = ref(null)
  const traveler_select_comp = ref(null)

  const handle_cabin_select_done = () => {
    if (isMobile()) return
    star_select_comp.value?.[0]?.open_dialog?.()
  }

  const handle_star_select_done = () => {
    if (isMobile()) return
    airport_picker_comp.value?.[0]?.open_dialog?.()
  }

  const handle_airport_picker_done = () => {
    if (isMobile()) return
    date_picker_comp.value?.[0]?.open_dialog?.()
  }

  const handle_date_picker_done = () => {
    if (isMobile()) return
    if(setting_expedia?.[PACKAGE_BUNDLE_IDS.TRAVELERS]?.disabled) return
    traveler_select_comp.value?.[0]?.open_dialog?.()
  }

  return computed(() => ({
    fields: [
      {
        id: PACKAGE_BUNDLE_IDS.DP_AIRPORT,
        component: CabinSelect,
        hidden: false,
        model: 'cabin_class',
        order: 1,
        events: {
          done: handle_cabin_select_done
        },
        bind: {
          rounded: true,
          dense: true,
          rules: rules.cabin_class,
          outlined: true,
          hide_label_mode: false,
          'hide-bottom-space': true,
          cabin_classes: props.product.cabin_classes,
          'emit-value': true,
          'map-options': true,
          prepend_icon: 'class',
          label: t('common.cabin-class')
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_BUNDLE_IDS.DP_AIRPORT,
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
                mobile: 6
              }
            }
          }
        })
      },
      {
        id: PACKAGE_BUNDLE_IDS.STARS,
        component: StarSelect,
        hidden: false,
        model: 'stars',
        order: 2,
        events: {
          done: handle_star_select_done
        },
        ref: star_select_comp,
        bind: {
          dense: true,
          outlined: true,
          'hide-bottom-space': true,
          'emit-value': true,
          'map-options': true,
          label: t('common.hotel-stars'),
          hide_label_mode: true,
          prepend_icon: 'star',
          rounded: true,
          color: props.color,
          show_label: true
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_BUNDLE_IDS.STARS,
          settings: setting_expedia,
          default_values: {
            order: {
              desktop: 2,
              tablet: 2,
              mobile: 2
            },
            dimension: {
              columns: {
                desktop: 2,
                tablet: 6,
                mobile: 6
              }
            }
          }
        })
      },
      {
        id: PACKAGE_BUNDLE_IDS.BOX1,
        component: BoxField,
        hidden: false,
        model: 'box1',
        order: 3,
        events: {},
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_BUNDLE_IDS.BOX1,
          settings: setting_expedia,
          default_values: {
            order: {
              desktop: 3,
              tablet: 3,
              mobile: 3
            },
            dimension: {
              columns: {
                desktop: 8,
                tablet: 0,
                mobile: 0
              }
            }
          }
        })
      },
      {
        id: PACKAGE_BUNDLE_IDS.AR_AIRPORT,
        component: AirportPicker,
        hidden: false,
        model: 'payload',
        order: 4,
        ref: airport_picker_comp,
        bind: {
          cities_with_airports: true,
          product: props.product,
          color: props.color,
          has_code: true,
          rules
        },
        events: {
          handle_swap_airport,
          done: handle_airport_picker_done
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_BUNDLE_IDS.AR_AIRPORT,
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
        id: PACKAGE_BUNDLE_IDS.FLIGHT_DATES,
        component: DatePicker,
        hidden: false,
        model: 'flight_dates',
        order: 5,
        ref: date_picker_comp,
        bind: {
          range: true,
          dense: true,
          outlined: true,
          'hide-bottom-space': true,
          rules: rules.dates,
          date_format,
          disabled_samedates: true,
          booking_cutoff_days: props.bundle.booking_cutoff_days,
          label: t('common.dates'),
          color: props.color,
          enable_only:
            setting_expedia?.[PACKAGE_BUNDLE_IDS.FLIGHT_DATES]?.enable_only
        },
        events: {
          handle_swap_airport,
          done: handle_date_picker_done
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_BUNDLE_IDS.FLIGHT_DATES,
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
        id: PACKAGE_BUNDLE_IDS.TRAVELERS,
        component: TravelerSelect,
        hidden: false,
        model: 'travelers',
        order: 6,
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
          traveler_limit_type: props.bundle?.traveler_limit_type,
          traveler_type_limits: props.bundle?.traveler_type_limits,
          total_traveler_limit: props.bundle?.total_traveler_limit,
          traveler_types: props.product.traveler_types,
          default_traveler_count: props.bundle.default_traveler_count,
          label: t('common.travelers'),
          color: props.color
        },
        events: {
          handle_swap_airport
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_BUNDLE_IDS.TRAVELERS,
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
        id: PACKAGE_BUNDLE_IDS.SEARCH_BTN,
        component: SearchBtn,
        hidden: false,
        model: 'payload',
        order: 7,
        events: {},
        bind: {
          label: t('common.search'),
          color: props.color,
          rounded: true
        },
        ...get_field_settings({
          field_id: PACKAGE_BUNDLE_IDS.SEARCH_BTN,
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
