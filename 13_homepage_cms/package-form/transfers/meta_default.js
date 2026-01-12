import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import key_by from 'lodash.keyby'
import DatePicker from 'src/components/common/date-picker'
import TravelerSelect from 'src/components/common/traveler-select'
import SearchBtn from '../search-btn'
import LocationPicker from './location-picker/index.vue'
import TimePicker from 'src/components/common/time-picker/index.vue'
import {
  get_field_settings,
  PACKAGE_TRANSFER_IDS
} from 'src/composables/utils/forms'
import { isMobile } from 'src/composables/utils/device-detect'

export const get_meta_default = (params) => {
  const { t } = useI18n()
  const { props, rules, traveler_limits, payload } = params
  const setting_default = props.setting?.meta?.default?.fields ?? {}
  const field_setting = key_by(setting_default, 'id') ?? {}

  const traveler_comp = ref(null)
  const date_picker_comp = ref(null)
  const time_picker_comp = ref(null)

  const handle_location_done = () => {
    if(isMobile()) return
    traveler_comp.value?.[0]?.open_dialog?.()
  }

  const handle_traveler_done = () => {
    if(isMobile()) return
    date_picker_comp.value?.[0].open_dialog?.()
  }
    
  const handle_date_done = () => {
    if(isMobile()) return
    time_picker_comp.value?.[0].open_dialog?.()
  }

  return computed(() => ({
    fields: [
      {
        id: PACKAGE_TRANSFER_IDS.AIRPORT,
        component: LocationPicker,
        hidden: false,
        disabled: false,
        model: 'payload',
        order: 1,
        events: {
          done: handle_location_done
        },
        bind: {
          node: props.node,
          from_airport: payload.value?.from_airport,
          default_destination: props.default_destination,
          disabled_destination: !!props?.default_destination?.id
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_TRANSFER_IDS.AIRPORT,
          settings: field_setting,
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
        id: PACKAGE_TRANSFER_IDS.DESTINATION,
        component: TravelerSelect,
        hidden: false,
        disabled: false,
        model: 'travelers',
        order: 3,
        ref: traveler_comp,
        events: {
          done: handle_traveler_done
        },
        bind: {
          dense: true,
          rules: rules.travelers,
          max_adults: +traveler_limits?.['adult']?.limit,
          max_infants: +traveler_limits?.['infant']?.limit,
          max_children: +traveler_limits?.['child']?.limit,
          traveler_limit_type: props.hotel?.traveler_limit_type,
          traveler_type_limits: props.hotel?.traveler_type_limits,
          total_traveler_limit: props.hotel?.total_traveler_limit,
          default_traveler_count: props.hotel?.default_traveler_count,
          traveler_types: props.product.traveler_types,
          outlined: true,
          'hide-bottom-space': true,
          label: t('common.travelers'),
          color: props.color
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_TRANSFER_IDS.DESTINATION,
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
        id: PACKAGE_TRANSFER_IDS.SEARCH_BTN,
        component: SearchBtn,
        hidden: false,
        disabled: false,
        model: 'btn',
        order: 7,
        events: {},
        bind: {
          label: t('common.search-now'),
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_TRANSFER_IDS.SEARCH_BTN,
          settings: field_setting,
          default_values: {
            order: {
              desktop: 3,
              tablet: 3,
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
      {
        id: PACKAGE_TRANSFER_IDS.PICKUP_DATE,
        component: DatePicker,
        hidden: false,
        disabled: false,
        model: 'pickup_date',
        order: 8,
        ref: date_picker_comp,
        events: {
          done: handle_date_done
        },
        bind: {
          dense: true,
          outlined: true,
          'hide-bottom-space': true,
          booking_cutoff_days: props.transfer.booking_cutoff_days,
          rules: rules.dates,
          color: props.color,
          label: t('common.pickup-date'),
          enable_only:
            field_setting?.[PACKAGE_TRANSFER_IDS.PICKUP_DATE]?.enable_only
        },
        ...get_field_settings({
          field_id: PACKAGE_TRANSFER_IDS.PICKUP_DATE,
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
        id: PACKAGE_TRANSFER_IDS.PICKUP_TIME,
        component: TimePicker,
        hidden: false,
        disabled: false,
        model: 'pickup_time',
        order: 8,
        ref: time_picker_comp,
        events: {},
        bind: {
          dense: true,
          outlined: true,
          color: props.color,
          'hide-bottom-space': true,
          rules: rules.dates,
          label: t('common.pickup-time')
        },
        ...get_field_settings({
          field_id: PACKAGE_TRANSFER_IDS.PICKUP_TIME,
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
      }
    ]
  }))
}
