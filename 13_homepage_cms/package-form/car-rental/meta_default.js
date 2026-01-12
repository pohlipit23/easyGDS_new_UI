import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import key_by from 'lodash.keyby'

import PlaceSelect from 'src/components/common/place-select'
import DatePicker from 'src/components/common/date-picker'
import SearchBtn from '../search-btn'
import TimePicker from 'src/components/common/time-picker/index.vue'
import DriverAge from 'src/components/common/driver-age/index.vue'

import DifferentDropoffLocation from './different-dropoff-location/index.vue'
import {
  get_field_settings,
  PACKAGE_CAR_RENTAL_IDS
} from 'src/composables/utils/forms'
import { isMobile } from 'src/composables/utils/device-detect'

export const get_meta_default = (params) => {
  const { t } = useI18n()
  const {
    props,
    rules,
    place_types,
    payload,
    validate_dropoff_date,
    dropoff_date_default_year_month
  } = params
  const setting_default = props.setting?.meta?.default?.fields ?? {}
  const field_setting = key_by(setting_default, 'id') ?? {}

  const pickup_date_comp = ref(null)
  const pickup_time_comp = ref(null)
  const driver_age_comp = ref(null)
  const dropoff_location_comp = ref(null)
  const dropoff_date_comp = ref(null)
  const dropoff_time_comp = ref(null)

  const handle_pickup_location_done = () => {
    if (isMobile()) return
    pickup_date_comp.value?.[0]?.open_dialog?.()
  }

  const handle_pickup_date_done = () => {
    if (isMobile()) return
    setTimeout(() => {
      pickup_time_comp.value?.[0]?.open_dialog?.()
    }, 300)
  }

  const handle_pickup_time_done = () => {
    if (isMobile()) return
    driver_age_comp.value?.[0]?.open_dialog?.()
  }

  const handle_driver_age_blur = () => {
    if (isMobile()) return
    dropoff_location_comp.value?.[0]?.open_dialog?.()
  }

  const handle_dropoff_location_done = () => {
    if (isMobile()) return
    dropoff_date_comp.value?.[0]?.open_dialog?.()
  }

  const handle_dropoff_date_done = () => {
    if (isMobile()) return
    dropoff_time_comp.value?.[0]?.open_dialog?.()
  }

  return computed(() => ({
    fields: [
      {
        id: PACKAGE_CAR_RENTAL_IDS.PICKUP_LOCATION,
        component: PlaceSelect,
        hidden: false,
        model: 'pickup_location',
        order: 1,
        events: {
          done: handle_pickup_location_done
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
          label: t('common.pickup-location')
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_CAR_RENTAL_IDS.PICKUP_LOCATION,
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
                tablet: 6,
                mobile: 12
              }
            }
          }
        })
      },
      {
        id: PACKAGE_CAR_RENTAL_IDS.PICKUP_DATE,
        component: DatePicker,
        hidden: false,
        model: 'pickup_date',
        order: 2,
        ref: pickup_date_comp,
        events: {
          done: handle_pickup_date_done
        },
        bind: {
          dense: true,
          outlined: true,
          rules: rules.dates,
          booking_cutoff_days: props.car_rental.booking_cutoff_days,
          'hide-bottom-space': true,
          label: t('common.pickup-date'),
          color: props.color,
          enable_only:
            field_setting?.[PACKAGE_CAR_RENTAL_IDS.PICKUP_DATE]?.enable_only
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_CAR_RENTAL_IDS.PICKUP_DATE,
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
        id: PACKAGE_CAR_RENTAL_IDS.PICKUP_TIME,
        component: TimePicker,
        hidden: false,
        model: 'pickup_time',
        order: 2,
        ref: pickup_time_comp,
        events: {
          done: handle_pickup_time_done
        },
        bind: {
          dense: true,
          outlined: true,
          rules: rules.dates,
          'hide-bottom-space': true,
          label: t('common.pickup-time'),
          color: props.color
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_CAR_RENTAL_IDS.PICKUP_TIME,
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
        id: PACKAGE_CAR_RENTAL_IDS.DRIVER_AGE,
        component: DriverAge,
        hidden: false,
        model: 'driver_age',
        order: 3,
        ref: driver_age_comp,
        events: {
          blur: handle_driver_age_blur
        },
        bind: {
          dense: true,
          type: 'number',
          outlined: true,
          'hide-bottom-space': true,
          rules: rules.place,
          label: t('common.driver-age'),
          color: props.color
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_CAR_RENTAL_IDS.DRIVER_AGE,
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
                tablet: 6,
                mobile: 12
              }
            }
          }
        })
      },
      {
        id: PACKAGE_CAR_RENTAL_IDS.DROPOFF_LOCATION,
        component: DifferentDropoffLocation,
        hidden: false,
        model: 'diff_dropoff',
        order: 4,
        ref: dropoff_location_comp,
        events: {
          done: handle_dropoff_location_done
        },
        bind: {
          place_types,
          form_data: payload.value.dropoff_data
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_CAR_RENTAL_IDS.DROPOFF_LOCATION,
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
                tablet: 6,
                mobile: 12
              }
            }
          }
        })
      },
      {
        id: PACKAGE_CAR_RENTAL_IDS.DROPOFF_DATE,
        component: DatePicker,
        hidden: false,
        model: 'dropoff_date',
        order: 5,
        ref: dropoff_date_comp,
        events: {
          done: handle_dropoff_date_done
        },
        bind: {
          dense: true,
          outlined: true,
          rules: rules.dates,
          booking_cutoff_days: props.car_rental.booking_cutoff_days,
          'hide-bottom-space': true,
          label: t('common.dropoff-date'),
          validate: validate_dropoff_date,
          default_year_month: dropoff_date_default_year_month,
          color: props.color,
          enable_only:
            field_setting?.[PACKAGE_CAR_RENTAL_IDS.DROPOFF_DATE]?.enable_only
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_CAR_RENTAL_IDS.DROPOFF_DATE,
          settings: field_setting,
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
        id: PACKAGE_CAR_RENTAL_IDS.DROPOFF_TIME,
        component: TimePicker,
        hidden: false,
        model: 'dropoff_time',
        order: 6,
        ref: dropoff_time_comp,
        events: {},
        bind: {
          dense: true,
          outlined: true,
          rules: rules.dropoff_time,
          'hide-bottom-space': true,
          label: t('common.dropoff-time'),
          color: props.color
        },
        style: {
          color: props.color
        },
        ...get_field_settings({
          field_id: PACKAGE_CAR_RENTAL_IDS.DROPOFF_TIME,
          settings: field_setting,
          default_values: {
            order: {
              desktop: 7,
              tablet: 7,
              mobile: 7
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
        id: PACKAGE_CAR_RENTAL_IDS.SEARCH_BTN,
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
          field_id: PACKAGE_CAR_RENTAL_IDS.SEARCH_BTN,
          settings: field_setting,
          default_values: {
            order: {
              desktop: 8,
              tablet: 8,
              mobile: 8
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
      }
    ]
  }))
}
