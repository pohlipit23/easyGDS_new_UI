import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import key_by from 'lodash.keyby'
import compact from 'lodash.compact'

import PlaceSelect from 'src/components/common/place-select'
import DatePicker from 'src/components/common/date-picker'
import TravelerSelect from 'src/components/common/traveler-select'
import SearchBtn from '../search-btn'
import { HOLIDAYS_PACKAGE_FORM_DESIGN } from 'src/constants'

import {
  get_field_settings,
  PACKAGE_HOTEL_IDS
} from 'src/composables/utils/forms'
import { isMobile } from 'src/composables/utils/device-detect'

export const get_meta_holidays = (params) => {
  const { t } = useI18n()
  const {
    props,
    rules,
    place_types,
    traveler_limits,
    group,
    on_change_crew_booking,
    is_crew_booking,
    crew_booking_rooms,
    show_crew_booking,
    places_and_properties,
    country_codes
  } = params
  const setting_default = props.setting?.meta?.default?.fields ?? {}
  const field_setting = key_by(setting_default, 'id') ?? {}

  const date_picker_comp = ref(null)
  const traveler_select_comp = ref(null)

  const handle_place_select_done = () => {
    if(isMobile()) return
    date_picker_comp.value?.[0]?.open_dialog?.()
  }

  return computed(() => ({
    fields: compact([
      {
        id: PACKAGE_HOTEL_IDS.DESTINATION,
        component: PlaceSelect,
        order: 1,
        events: {
          done: handle_place_select_done
        },
        style: {
          color: props.color
        },
        bind: {
          color: props.color,
          design: HOLIDAYS_PACKAGE_FORM_DESIGN,
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
          label: t('common.where-are-you-going'),
          places_and_properties: places_and_properties,
          country_codes: country_codes,
          default_search_text: props.setting?.default_values?.search_text
        },
        model: 'place',
        ...get_field_settings({
          field_id: PACKAGE_HOTEL_IDS.DESTINATION,
          settings: field_setting,
          default_values: {
            disabled: !!props?.default_destination?.id,
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
        id: PACKAGE_HOTEL_IDS.DATES,
        component: DatePicker,
        hidden: false,
        model: 'dates',
        order: 2,
        events: {
          done: () => {
            if(isMobile()) return
            if(field_setting?.[PACKAGE_HOTEL_IDS.TRAVELERS]?.disabled) return
            traveler_select_comp.value?.[0]?.open_dialog()
          }
        },
        ref: date_picker_comp,
        bind: {
          design: HOLIDAYS_PACKAGE_FORM_DESIGN,
          readonly: false,
          range: true,
          dense: true,
          outlined: true,
          booking_cutoff_days: props.hotel.booking_cutoff_days,
          rules: rules.dates,
          'hide-bottom-space': true,
          color: props.color,
          label_departure: t('common.checkin-date'),
          label_return: t('common.checkout-date'),
          disabled_samedates: true,
          enable_only: field_setting?.[PACKAGE_HOTEL_IDS.DATES]?.enable_only
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_HOTEL_IDS.DATES,
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
        events: {
          on_change_crew_booking: on_change_crew_booking
        },
        bind: {
          design: HOLIDAYS_PACKAGE_FORM_DESIGN,
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
          is_crew_booking: is_crew_booking,
          crew_booking_rooms: crew_booking_rooms,
          with_rooms: true,
          outlined: true,
          show_crew_booking,
          'hide-bottom-space': true,
          color: props.color,
          label: t('common.travelers')
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_HOTEL_IDS.TRAVELERS,
          settings: field_setting,
          default_values: {
            order: {
              desktop: 3,
              tablet: 3,
              mobile: 3
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
        id: PACKAGE_HOTEL_IDS.SEARCH_BTN,
        component: SearchBtn,
        model: 'payload',
        order: 4,
        events: {},
        bind: {
          design: HOLIDAYS_PACKAGE_FORM_DESIGN,
          label: t('common.search-now'),
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_HOTEL_IDS.SEARCH_BTN,
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
      },
    ])
  }))
}
