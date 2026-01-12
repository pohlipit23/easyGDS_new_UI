import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import key_by from 'lodash.keyby'
import compact from 'lodash.compact'
import DatePicker from 'src/components/common/date-picker'
import TravelerSelect from 'src/components/common/traveler-select'
import SearchBtn from '../search-btn'
import { HOLIDAYS_PACKAGE_FORM_DESIGN } from 'src/constants'
import { change_datetime_format } from 'src/composables/utils'
import {
  get_field_settings,
  PACKAGE_BUNDLE_IDS
} from 'src/composables/utils/forms'
import CabinSelect from 'src/components/common/cabin-select/index.vue'
import SeparateCheckInput from 'src/components/common/package-form/bundle/separate-check-input/holidays.vue'
import AirportPicker from 'src/components/common/airport-picker/index.vue'
import { isMobile } from 'src/composables/utils/device-detect'

export const get_meta_holidays = (params) => {
  const { t } = useI18n()
  const {
    props,
    rules,
    traveler_limits,
    date_format,
    payload,
    validate_airport,
    hide_separate_dates,
    handle_swap_airport
  } = params
  const setting_default = props.setting?.meta?.default?.fields ?? {}
  const field_setting = key_by(setting_default, 'id') ?? {}

  const airport_picker_comp = ref(null)
  const flight_date_picker_comp = ref(null)
  const hotel_date_picker_comp = ref(null)
  const traveler_select_comp = ref(null)
  const cabin_select_comp = ref(null)
  const separate_check_input_comp = ref(null)

  const handle_airport_picker_done = () => {
    if (isMobile()) return
    flight_date_picker_comp.value?.[0]?.open_dialog?.()
  }

  const handle_flight_date_picker_done = () => {
    if (isMobile()) return
    if (payload.value.form_data.separate) {
      hotel_date_picker_comp.value?.[0]?.open_dialog?.()
    } else {
      traveler_select_comp.value?.[0]?.open_dialog?.()
    }
  }

  const handle_hotel_date_picker_done = () => {
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
        id: PACKAGE_BUNDLE_IDS.AR_AIRPORT,
        component: AirportPicker,
        hidden: false,
        model: 'payload',
        order: 1,
        ref: airport_picker_comp,
        bind: {
          design: HOLIDAYS_PACKAGE_FORM_DESIGN,
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
          settings: field_setting,
          default_values: {
            order: {
              desktop: 1,
              tablet: 1,
              mobile: 1
            },
            dimension: {
              columns: {
                desktop: 7,
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
        ref: flight_date_picker_comp,
        events: {
          done: handle_flight_date_picker_done
        },
        bind: {
          design: HOLIDAYS_PACKAGE_FORM_DESIGN,
          range: true,
          dense: true,
          outlined: true,
          'hide-bottom-space': true,
          date_format,
          booking_cutoff_days: props.bundle.booking_cutoff_days,
          rules: rules.flight_dates,
          color: props.color,
          label_departure: t('common.departure-date'),
          label_return: t('common.return-date'),
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
                desktop: 5,
                tablet: 12,
                mobile: 12
              }
            }
          }
        })
      },
      payload.value.form_data.separate && {
        id: PACKAGE_BUNDLE_IDS.HOTEL_DATES,
        component: DatePicker,
        hidden: false,
        model: 'hotel_dates',
        order: 3,
        ref: hotel_date_picker_comp,
        events: {
          done: handle_hotel_date_picker_done
        },
        bind: {
          design: HOLIDAYS_PACKAGE_FORM_DESIGN,
          range: true,
          dense: true,
          outlined: true,
          'hide-bottom-space': true,
          date_format,
          booking_cutoff_days: props.bundle.booking_cutoff_days,
          label_departure: t('common.checkin-date'),
          label_return: t('common.checkout-date'),
          rules: [
            () => {
              let quasar_format = 'YYYY/MM/DD'
              const val = payload.value.hotel_dates;
              if (!!val) {
                const start_date = change_datetime_format(
                  val[0],
                  date_format,
                  quasar_format
                )
                const end_date = change_datetime_format(
                  val[1],
                  date_format,
                  quasar_format
                )

                let departure_date = change_datetime_format(
                  payload.value.flight_dates?.[0],
                  date_format,
                  quasar_format
                )
                let return_date = change_datetime_format(
                  payload.value.flight_dates?.[1],
                  date_format,
                  quasar_format
                )
                if (start_date < departure_date || end_date > return_date) {
                  return ''
                }
                return true
              }
              return ''
            }
          ],
          color: props.color,
          validate: (date) => {
            let quasar_format = 'YYYY/MM/DD'
            let departure_date = change_datetime_format(
              payload.value.flight_dates?.[0],
              date_format,
              quasar_format
            )
            let return_date = change_datetime_format(
              payload.value.flight_dates?.[1],
              date_format,
              quasar_format
            )
            return departure_date <= date && date <= return_date
          }
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_BUNDLE_IDS.HOTEL_DATES,
          settings: field_setting,
          default_values: {
            order: {
              desktop: 3,
              tablet: 3,
              mobile: 3
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
          design: HOLIDAYS_PACKAGE_FORM_DESIGN,
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
                desktop: 5,
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
          design: HOLIDAYS_PACKAGE_FORM_DESIGN,
          dense: true,
          rules: rules.cabin_class,
          outlined: true,
          'hide-bottom-space': true,
          cabin_classes: props.product.cabin_classes,
          'emit-value': true,
          'map-options': true,
          prepend_icon: 'class',
          label: t('common.cabin-class'),
          color: props.color
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
                desktop: 5,
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
          design: HOLIDAYS_PACKAGE_FORM_DESIGN,
          label: t('common.search'),
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_BUNDLE_IDS.SEARCH_BTN,
          settings: field_setting,
          default_values: {
            order: {
              desktop: 8,
              tablet: 10,
              mobile: 10
            },
            dimension: {
              columns: {
                desktop: 2,
                tablet: 12,
                mobile: 12
              }
            }
          }
        })
      },
      !hide_separate_dates &&
        payload.value.flight_dates?.[0] && {
          id: PACKAGE_BUNDLE_IDS.SEPARATE_CHECK_INPUT,
          component: SeparateCheckInput,
          hidden: false,
          model: 'form_data',
          model_path: 'separate',
          order: 7,
          events: {},
          bind: {
            design: HOLIDAYS_PACKAGE_FORM_DESIGN,
            color: props.color,
            payload
          },
          style: {
            color: props.color
          },
          ...get_field_settings({
            field_id: PACKAGE_BUNDLE_IDS.SEPARATE_CHECK_INPUT,
            settings: field_setting,
            default_values: {
              order: {
                desktop: 8,
                tablet: 8,
                mobile: 8
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
        }
    ])
  }))
}
