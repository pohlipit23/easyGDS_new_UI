import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import DatePicker from 'src/components/common/date-picker'
import TravelerSelect from 'src/components/common/traveler-select'
import PlaceSelect from 'src/components/common/place-select/index.vue'
import SearchBtn from '../search-btn'

import {
  get_field_settings,
  PACKAGE_HOTEL_IDS
} from 'src/composables/utils/forms'
import { isMobile } from 'src/composables/utils/device-detect'

export const get_meta_expedia = (params) => {
  const { t } = useI18n()
  const { props, rules, traveler_limits, place_types, places_and_properties, country_codes } = params
  const setting_expedia = props.setting?.meta?.expedia?.fields ?? {}

  const date_picker_comp = ref(null)
  const traveler_select_comp = ref(null)

  const handle_place_select_done = () => {
    if(isMobile()) return
    date_picker_comp.value?.[0]?.open_dialog?.()
  }

  const handle_date_picker_done = () => {
    if(isMobile()) return
    if(setting_expedia?.[PACKAGE_HOTEL_IDS.TRAVELERS]?.disabled) return
    traveler_select_comp.value?.[0]?.open_dialog?.()
  }

  return computed(() => ({
    fields: [
      {
        id: PACKAGE_HOTEL_IDS.DESTINATION,
        component: PlaceSelect,
        hidden: false,
        disabled: false,
        model: 'place',
        order: 1,
        events: {
          done: handle_place_select_done
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
          label: t('common.going-to'),
          places_and_properties: places_and_properties,
          country_codes: country_codes,
          default_search_text: props.setting?.default_values?.search_text
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_HOTEL_IDS.DESTINATION,
          settings: setting_expedia,
          default_values: {
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
        id: PACKAGE_HOTEL_IDS.DATES,
        component: DatePicker,
        hidden: false,
        model: 'dates',
        order: 2,
        ref: date_picker_comp,
        events: {
          done: handle_date_picker_done
        },
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
          disabled_samedates: true,
          enable_only: setting_expedia?.[PACKAGE_HOTEL_IDS.DATES]?.enable_only
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_HOTEL_IDS.DATES,
          settings: setting_expedia,
          default_values: {
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
        id: PACKAGE_HOTEL_IDS.TRAVELERS,
        component: TravelerSelect,
        hidden: false,
        model: 'travelers',
        order: 3,
        ref: traveler_select_comp,
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
          'hide-bottom-space': true,
          color: props.color,
          label: t('common.travelers')
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_HOTEL_IDS.TRAVELERS,
          settings: setting_expedia,
          default_values: {
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
        id: PACKAGE_HOTEL_IDS.SEARCH_BTN,
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
          field_id: PACKAGE_HOTEL_IDS.SEARCH_BTN,
          settings: setting_expedia,
          default_values: {
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
