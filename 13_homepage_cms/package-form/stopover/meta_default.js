import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import key_by from 'lodash.keyby'

import PlaceSelect from 'src/components/common/place-select'
import DatePicker from 'src/components/common/date-picker'
import TravelerSelect from 'src/components/common/traveler-select'
import SearchBtn from '../search-btn'

import {
  get_field_settings,
  PACKAGE_STOPOVER_IDS
} from 'src/composables/utils/forms'

export const get_meta_default = (params) => {
  const { t } = useI18n()
  const { props, rules, place_types, traveler_limits } = params
  const setting_default = props.setting?.meta?.default?.fields ?? {}
  const field_setting = key_by(setting_default, 'id') ?? {}

  return computed(() => ({
    fields: [
      {
        id: PACKAGE_STOPOVER_IDS.DESTINATION,
        component: PlaceSelect,
        order: 1,
        events: {},
        style: {
          color: props.color
        },
        bind: {
          dense: true,
          cities_with_airports: false,
          types: place_types,
          rules: rules.place,
          outlined: true,
          'hide-bottom-space': true,
          'hide-selected': true,
          'fill-input': true,
          prepend_icon: 'place',
          has_code: false,
          disable_loadmore: true,
          with_properties: true,
          hotel_places: true,
          label: t('common.where-are-you-going')
        },
        model: 'place',
        ...get_field_settings({
          field_id: PACKAGE_STOPOVER_IDS.DESTINATION,
          settings: field_setting,
          default_values: {
            disabled: true,
            order: {
              desktop: 1,
              tablet: 1,
              mobile: 1
            },
            dimension: {
              columns: {
                desktop: 4,
                tablet: 12,
                mobile: 12
              }
            }
          }
        })
      },
      {
        id: PACKAGE_STOPOVER_IDS.DATES,
        component: DatePicker,
        hidden: false,
        model: 'dates',
        order: 2,
        events: {},
        bind: {
          readonly: false,
          range: true,
          dense: true,
          outlined: true,
          booking_cutoff_days: props.hotel.booking_cutoff_days,
          rules: rules.dates,
          'hide-bottom-space': true,
          color: props.color,
          label: t('common.checkin-checkout'),
          enable_only: field_setting?.[PACKAGE_STOPOVER_IDS.DATES]?.enable_only
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_STOPOVER_IDS.DATES,
          settings: field_setting,
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
        id: PACKAGE_STOPOVER_IDS.TRAVELERS,
        component: TravelerSelect,
        hidden: false,
        model: 'travelers',
        order: 3,
        events: {},
        bind: {
          dense: true,
          max_rooms: 3,
          rules: rules.travelers,
          max_adults: +traveler_limits?.['adult']?.limit,
          max_infants: +traveler_limits?.['infant']?.limit,
          max_children: +traveler_limits?.['child']?.limit,
          traveler_limit_type: props.hotel?.traveler_limit_type,
          traveler_type_limits: props.hotel?.traveler_type_limits,
          total_traveler_limit: props.hotel?.total_traveler_limit,
          default_traveler_count: props.hotel?.default_traveler_count,
          traveler_types: props.product.traveler_types,
          with_rooms: true,
          outlined: true,
          color: props.color,
          'hide-bottom-space': true,
          label: t('common.travelers')
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_STOPOVER_IDS.TRAVELERS,
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
                tablet: 6,
                mobile: 12
              }
            }
          }
        })
      },
      {
        id: PACKAGE_STOPOVER_IDS.SEARCH_BTN,
        component: SearchBtn,
        model: 'payload',
        order: 4,
        events: {},
        bind: {
          label: t('common.search-now'),
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_STOPOVER_IDS.SEARCH_BTN,
          settings: field_setting,
          default_values: {
            order: {
              desktop: 4,
              tablet: 4,
              mobile: 4
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
      }
    ]
  }))
}
