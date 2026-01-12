import { computed , ref} from 'vue'
import { useI18n } from 'vue-i18n'
import key_by from 'lodash.keyby'

import PlaceSelect from 'src/components/common/place-select'
import DatePicker from 'src/components/common/date-picker'
import TravelerSelect from 'src/components/common/traveler-select'
import SearchBtn from '../search-btn'
import {
  get_field_settings,
  PACKAGE_TOUR_IDS
} from 'src/composables/utils/forms'
import { isMobile } from 'src/composables/utils/device-detect'

export const get_meta_default = (params) => {
  const { t } = useI18n()
  const { props, rules, place_types, traveler_limits } = params
  const setting_default = props.setting?.meta?.default?.fields ?? {}
  const field_setting = key_by(setting_default, 'id') ?? {}

  const date_picker_comp = ref(null)
  const traveler_select_comp = ref(null)

  const handle_place_select_done = () => {
    if(isMobile()) return
    date_picker_comp.value?.[0]?.open_dialog?.()
  }

  const handle_date_picker_done = () => {
    if(isMobile()) return
    if(field_setting?.[PACKAGE_TOUR_IDS.TRAVELERS]?.disabled) return
    traveler_select_comp.value?.[0]?.open_dialog?.()
  }


  return computed(() => ({
    fields: [
      {
        id: PACKAGE_TOUR_IDS.DESTINATION,
        component: PlaceSelect,
        hidden: false,
        model: 'place',
        order: 1,
        events: {
          done: handle_place_select_done
        },
        bind: {
          dense: true,
          types: place_types,
          rules: rules.place,
          outlined: true,
          'hide-bottom-space': true,
          'hide-selected': true,
          'fill-input': true,
          prepend_icon: 'place',
          has_code: true,
          label: t('common.where-are-you-going')
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_TOUR_IDS.DESTINATION,
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
                desktop: 3,
                tablet: 12,
                mobile: 12
              }
            }
          }
        })
      },
      {
        id: PACKAGE_TOUR_IDS.DATES,
        component: DatePicker,
        hidden: false,
        model: 'dates',
        order: 2,
        events: {
          done: handle_date_picker_done
        },
        ref: date_picker_comp,
        bind: {
          range: true,
          dense: true,
          outlined: true,
          booking_cutoff_days: props.tour.booking_cutoff_days,
          rules: rules.dates,
          'hide-bottom-space': true,
          color: props.color,
          label: t('tour.checkin')+' / '+t('tour.checkout'),
          enable_only: field_setting?.[PACKAGE_TOUR_IDS.DATES]?.enable_only
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_TOUR_IDS.DATES,
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
                tablet: 12,
                mobile: 12
              }
            }
          }
        })
      },
      {
        id: PACKAGE_TOUR_IDS.TRAVELERS,
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
          traveler_limit_type: props.tour?.traveler_limit_type,
          traveler_type_limits: props.tour?.traveler_type_limits,
          total_traveler_limit: props.tour?.total_traveler_limit,
          default_traveler_count: props.tour?.default_traveler_count,
          traveler_types: props.product.traveler_types,
          outlined: true,
          color: props.color,
          'hide-bottom-space': true,
          label: t('common.travelers')
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_TOUR_IDS.TRAVELERS,
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
        id: PACKAGE_TOUR_IDS.SEARCH_BTN,
        component: SearchBtn,
        hidden: false,
        disabled: false,
        model: 'payload',
        order: 7,
        events: {},
        bind: {
          label: t('common.search-now'),
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_TOUR_IDS.SEARCH_BTN,
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
      }
    ]
  }))
}
