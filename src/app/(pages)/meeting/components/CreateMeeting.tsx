/* eslint-disable no-unsafe-optional-chaining */
import * as Yup from 'yup';
import { meetingService } from '@/app/services/meeting.service';
import { toast } from 'react-toastify';
import { AppDispatch } from '@/redux/store';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import WhiteButton from '@/app/component/customButton/white';
import CustomButton from '@/app/component/customButton/button';
import { useFormik } from 'formik';
import ModalComponent from '@/app/component/modal';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { CloseOutlined } from '@ant-design/icons';
import { InputComponent } from '@/app/component/customInput/Input';
import { DateInputComponent } from '@/app/component/cutomDate/CustomDateInput';
import {
  addNewMeetingAction,
  updateMeetingAction,
} from '@/redux/meeting/meeting.slice';
// import Description from '@/app/component/description';
import { SelectComponent } from '@/app/component/customSelect/Select.component';
import { dayjs, disabledDate } from '@/app/utils/date.utils';

import { IMeeting } from '@/app/interfaces/meeting.type';
import { ShouldHaveAtLeastCharacterRegex } from '@/app/utils/regex.util';
import { Checkbox } from 'antd';
import dj from 'dayjs';
import { SelectTimezone } from '@/app/component/customSelect/SelectTimezone';
import { Timezone } from '@/app/utils/timezone.utils';
import moment from 'moment';

type Props = {
  showModal: boolean;
  setShowModal(): void;
  onSuccess?: (_meeting: IMeeting) => void;
  isInviteOptional?: boolean;
  meeting?: IMeeting;
};
const CUSTOM_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss'; // Custom date format

// let timezones = Intl.supportedValuesOf('timeZone');

const dateValidation = Yup.date().required('Date is required');

const recurrenceSchema = Yup.object().shape({
  isChecked: Yup.boolean(),
  frequency: Yup.mixed()
    .oneOf(['daily', 'weekly', 'monthly', 'custom'], 'Invalid frequency type')
    .when('isChecked', {
      is: true,
      then: () => Yup.string().required('Recurrence frequency is required'),
      otherwise: () => Yup.string().notRequired(),
    }),
  days: Yup.array()
    .of(Yup.string().required('Day is required'))
    .min(1, 'At least one day is required')
    .when('frequency', {
      is: 'weekly',
      then: () =>
        Yup.array().required().min(1, 'Select at least one day').optional(),
      // .required('Days are required'),
      otherwise: () => Yup.array().notRequired(),
    }),
  dates: Yup.array()
    .of(dateValidation)
    .when('frequency', {
      is: 'custom',
      then: () =>
        Yup.array()
          .of(dateValidation)
          .min(1, 'At least one custom date is required')
          .required('Dates are required'),
      otherwise: () => Yup.array().notRequired(),
    }),
  endsOn: Yup.string()
    .oneOf(['never', 'date'], 'Invalid end option')
    .when('frequency', {
      is: 'custom',
      then: () =>
        Yup.string().required('End option is required for custom recurrence'),
      otherwise: () => Yup.string().notRequired(),
    }),
  endDate: Yup.date().when('endsOn', {
    is: 'date',
    then: () => dateValidation.required('End date is required'),
    otherwise: () => Yup.date().notRequired(),
  }),
});

export function CreateMeeting({
  showModal,
  setShowModal,
  onSuccess,
  meeting,
  isInviteOptional = false,
}: Props) {
  const [isScheduling, setIsScheduling] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const CreateMeetingSchema = Yup.object().shape({
    topic: Yup.string()
      .matches(
        ShouldHaveAtLeastCharacterRegex,
        'Topic should have atleast 1 character.'
      )
      .required('Topic is required'),
    email: isInviteOptional
      ? Yup.array().of(Yup.string().email('is invalid\n'))
      : Yup.array()
          .min(1)
          .of(
            Yup.string()
              .email('is invalid email\n')
              .required('Email is required')
          )
          .required('Email is required'),
    startDate: Yup.date().required('Start Time is required'),
    recurrence: Yup.lazy((value) => {
      if (!value || !value.isChecked) {
        return Yup.mixed().notRequired();
      }
      return recurrenceSchema;
    }),
  });

  const formik = useFormik({
    initialValues: meeting
      ? {
          topic: meeting.topic,
          email: meeting.invitees,
          startDate: meeting.startDate,
          // .tz((timezone as ITimezoneOption).value)
          recurrence: meeting.recurrence,
          timezone: meeting.timezone,
        }
      : {
          topic: '',
          email: [],
          // startDate: dayjs()
          //   .tz((timezone as ITimezoneOption).value)
          //   .format('YYYY-MM-DDTHH:mm:ss'),
          startDate: dj().format('YYYY-MM-DDTHH:mm:ss'),
          recurrence: {
            isChecked: false,
          } as IMeeting['recurrence'],
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
    validationSchema: CreateMeetingSchema,
    enableReinitialize: meeting ? true : false,
    onSubmit(values) {
      setIsScheduling(true);
      if (meeting) {
        meetingService
          .httpUpdateMeeting(meeting._id, {
            startDate: moment.utc(values.startDate).format(CUSTOM_DATE_FORMAT),
            endDate: moment.utc(values.startDate).format(CUSTOM_DATE_FORMAT),
            invitees: values.email as unknown as string[],
            link: meeting.link,
            roomName: meeting.roomName,
            topic: values.topic,
            recurrence: values.recurrence,
            timezone: values.timezone,
            timezoneData: Timezone.getByValue(values.timezone),
          })
          .then((response) => {
            if (response.data) {
              dispatch(updateMeetingAction(response.data.meeting));
              if (onSuccess) {
                onSuccess(response.data.meeting);
              }
            }
            setIsScheduling(false);
            setShowModal();
            formik.resetForm();
          })
          .catch(({ response }: any) => {
            setIsScheduling(false);
            toast.error(response.data.message);
          });
      } else {
        let roomName = `Schesti-${Math.random() * 1000}`;
        const { endDate, startDate } = getStartAndEndDate(
          values.startDate,
          values.recurrence
        );

        meetingService
          .httpCreateMeeting({
            startDate,
            endDate,
            invitees: values.email as unknown as string[],
            roomName,
            link: `${process.env.NEXT_PUBLIC_APP_URL}/meeting/${roomName}`,
            topic: values.topic,
            recurrence: values.recurrence,
            timezone: values.timezone,
            timezoneData: Timezone.getByValue(values.timezone),
          })
          .then((response) => {
            if (response.data) {
              dispatch(addNewMeetingAction(response.data.meeting));
              if (onSuccess) {
                onSuccess(response.data.meeting);
              }
            }
            setIsScheduling(false);
            setShowModal();
            formik.resetForm();
          })
          .catch(({ response }: any) => {
            setIsScheduling(false);
            toast.error(response.data.message);
          });
      }
    },
  });
  function getStartAndEndDate(
    startDate: string,
    recurrence: IMeeting['recurrence']
  ) {
    if (
      recurrence &&
      recurrence.isChecked &&
      recurrence.frequency === 'custom'
    ) {
      if (recurrence.dates.length > 0) {
        console.log('Inside custom recurrence', recurrence.dates);
        const minDate = moment.min(recurrence.dates.map((d) => moment(d)));
        console.log(moment(minDate).format(CUSTOM_DATE_FORMAT));

        const newStartDate = minDate.clone().set({
          minute: moment.utc(startDate).minute(),
          hour: moment.utc(startDate).hour(),
        });
        const endDate = newStartDate.clone().add(40, 'minutes');
        console.log(
          'newStartDate',
          newStartDate.toString(),
          endDate.toString()
        );
        return {
          startDate: newStartDate.format(CUSTOM_DATE_FORMAT),
          endDate: endDate.format(CUSTOM_DATE_FORMAT),
        };
      }
    }
    console.log('Outside custom recurrence');
    startDate = moment.utc(startDate).format(CUSTOM_DATE_FORMAT);
    const endDate = moment
      .utc(startDate)
      .add(40, 'minutes')
      .format(CUSTOM_DATE_FORMAT);
    return {
      startDate,
      endDate,
    };
  }
  function handleCloseModal() {
    setShowModal();
    formik.resetForm();
  }
  const recurrenceTouched = formik.touched.recurrence as any;
  const recurrenceError = formik.errors.recurrence as any;
  return (
    <ModalComponent
      width="50%"
      open={showModal}
      setOpen={handleCloseModal}
      title="Schedule a meeting"
      destroyOnClose
    >
      <div className="bg-white border border-solid border-elboneyGray rounded-[4px] z-50">
        <div className="flex px-6 py-2.5 justify-between bg-schestiLightPrimary">
          <TertiaryHeading
            title="Schedule a meeting"
            className="text-graphiteGray"
          />
          <CloseOutlined
            className="cursor-pointer"
            style={{ width: '24px', height: '24px' }}
            onClick={handleCloseModal}
          />
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="px-6 py-2.5 space-y-3">
            <InputComponent
              label="Title"
              type="text"
              placeholder="Title"
              name="topic"
              hasError={formik.touched.topic && Boolean(formik.errors.topic)}
              field={{
                value: formik.values.topic,
                onChange: formik.handleChange,
                onBlur: formik.handleBlur,
              }}
              errorMessage={
                formik.touched.topic && formik.errors.topic
                  ? formik.errors.topic
                  : undefined
              }
            />
            <SelectComponent
              label="Invite"
              placeholder="Email Address"
              name="email"
              hasError={formik.touched.email && Boolean(formik.errors.email)}
              errorMessage={
                formik.touched.email && Boolean(formik.errors.email)
                  ? Array.isArray(formik.errors.email)
                    ? formik.errors.email
                        .map(
                          (item: string, idx) =>
                            `'${formik.values.email![idx]}' ${item}`
                        )
                        .toString()
                    : (formik.errors.email as string)
                  : ''
              }
              field={{
                mode: 'tags',
                value: formik.values.email,
                onChange: (value) => formik.setFieldValue('email', value),
                onBlur: formik.handleBlur,
                status:
                  formik.touched.email && Boolean(formik.errors.email)
                    ? 'error'
                    : undefined,
              }}
            />

            {/* Recurrence */}
            <div>
              <Checkbox
                checked={formik.values.recurrence?.isChecked}
                onChange={(e) => {
                  formik.setFieldValue(
                    'recurrence.isChecked',
                    e.target.checked
                  );
                }}
              >
                <span className="text-graphiteGray">Add Recurrence</span>
              </Checkbox>

              {formik.values.recurrence?.isChecked ? (
                <>
                  <SelectComponent
                    label="Recurrence Type"
                    name="recurrence.frequency"
                    placeholder="Select Recurrence Type"
                    field={{
                      value: formik.values.recurrence?.frequency,
                      options: [
                        { label: 'Daily', value: 'daily' },
                        { label: 'Weekly', value: 'weekly' },
                        { label: 'Monthly', value: 'monthly' },
                        { label: 'Custom', value: 'custom' },
                      ],
                      onChange: (value) => {
                        formik.setFieldValue('recurrence.frequency', value);
                      },
                      onBlur: formik.handleBlur,
                    }}
                    hasError={
                      recurrenceTouched &&
                      recurrenceError &&
                      recurrenceTouched.frequency &&
                      Boolean(recurrenceError.frequency)
                    }
                    errorMessage={
                      recurrenceError && Boolean(recurrenceError.frequency)
                        ? recurrenceError.frequency
                        : undefined
                    }
                  />

                  {formik.values.recurrence?.frequency === 'weekly' ? (
                    <>
                      {/* <SelectComponent
                        label="Select Days"
                        name="recurrence.days"
                        placeholder="Select Days"
                        field={{
                          value: formik.values.recurrence?.days?.map(day => Number(day)),
                          options: [
                            { label: 'Monday', value: 1 },
                            { label: 'Tuesday', value: 2 },
                            { label: 'Wednesday', value: 3 },
                            { label: 'Thursday', value: 4 },
                            { label: 'Friday', value: 5 },
                            { label: 'Saturday', value: 6 },
                            { label: 'Sunday', value: 0 },
                          ],
                          mode: 'multiple',
                          onChange: (value) => {
                            formik.setFieldValue('recurrence.days', value);
                          },
                          onBlur: formik.handleBlur,
                        }}
                        hasError={
                          recurrenceTouched &&
                          recurrenceError &&
                          (recurrenceTouched as any).days &&
                          Boolean((recurrenceError as any).days)
                        }
                        // @ts-ignore
                        errorMessage={
                          recurrenceError &&
                            Boolean((recurrenceError as any).days)
                            ? (recurrenceError as any).days
                            : undefined
                        }
                      /> */}
                    </>
                  ) : null}

                  {formik.values.recurrence?.frequency === 'custom' ? (
                    <>
                      <DateInputComponent
                        label="Select Date"
                        name="recurrence.dates"
                        fieldProps={{
                          // @ts-ignore
                          value:
                            'dates' in formik.values.recurrence
                              ? formik.values.recurrence?.dates.map((date) =>
                                  dj(date)
                                )
                              : undefined,
                          multiple: true,
                          maxTagCount: 'responsive',
                          onChange(date, dateString) {
                            console.log('Date String', dateString);
                            formik.setFieldValue(
                              'recurrence.dates',
                              dateString
                            );
                          },
                          format: 'DD-MMM-YYYY',
                          disabledDate: (curr) => {
                            return curr.isBefore(dayjs());
                          },
                          disabled: meeting ? true : false,
                        }}
                        // @ts-ignore
                        hasError={
                          recurrenceTouched &&
                          recurrenceError &&
                          recurrenceTouched.dates &&
                          Boolean(recurrenceError.dates)
                        }
                        // @ts-ignore
                        errorMessage={
                          recurrenceError && Boolean(recurrenceError.dates)
                            ? recurrenceError.dates
                            : undefined
                        }
                      />

                      <SelectComponent
                        label="Ends On"
                        name="recurrence.endsOn"
                        placeholder="Select Ends On"
                        field={{
                          value: formik.values.recurrence?.endsOn,
                          options: [
                            { label: 'Never', value: 'never' },
                            { label: 'Date', value: 'date' },
                          ],
                          onChange: (value) => {
                            formik.setFieldValue('recurrence.endsOn', value);
                          },
                          onBlur: formik.handleBlur,
                        }}
                        // @ts-ignore
                        hasError={
                          recurrenceTouched &&
                          recurrenceError &&
                          recurrenceTouched.endsOn &&
                          Boolean(recurrenceError.endsOn)
                        }
                        // @ts-ignore
                        errorMessage={
                          recurrenceError && Boolean(recurrenceError.endsOn)
                            ? recurrenceError.endsOn
                            : undefined
                        }
                      />

                      {formik.values.recurrence?.endsOn === 'date' ? (
                        <>
                          <DateInputComponent
                            label="Select Date"
                            name="recurrence.endDate"
                            fieldProps={{
                              value:
                                'endDate' in formik.values.recurrence
                                  ? dj(formik.values.recurrence?.endDate)
                                  : undefined,
                              onChange(date, dateString) {
                                formik.setFieldValue(
                                  'recurrence.endDate',
                                  dateString
                                );
                              },
                              format: 'MM/DD/YYYY',
                              onBlur: formik.handleBlur,
                              disabledDate: (curr) => {
                                if (
                                  formik.values.recurrence?.isChecked &&
                                  formik.values.recurrence?.frequency ===
                                    'custom' &&
                                  formik.values.recurrence?.dates?.length > 0
                                ) {
                                  const startDate = moment(
                                    Math.min(
                                      // eslint-disable-next-line no-unsafe-optional-chaining
                                      ...formik.values.recurrence?.dates.map(
                                        (date) => new Date(date).getTime()
                                      )
                                    )
                                  );
                                  const endDate = moment(
                                    Math.max(
                                      // eslint-disable-next-line no-unsafe-optional-chaining
                                      ...formik.values.recurrence?.dates.map(
                                        (date) => new Date(date).getTime()
                                      )
                                    )
                                  );

                                  return (
                                    moment(curr.toDate()).isBetween(
                                      startDate,
                                      endDate,
                                      'day',
                                      '[]'
                                    ) || moment().isAfter(curr.toDate())
                                  );
                                } else {
                                  return false;
                                }
                              },
                            }}
                            // @ts-ignore
                            hasError={
                              recurrenceTouched &&
                              recurrenceError &&
                              recurrenceTouched.endDate &&
                              Boolean(recurrenceError.endDate)
                            }
                            // @ts-ignore
                            errorMessage={
                              recurrenceError && recurrenceError.endDate
                                ? recurrenceError.endDate
                                : undefined
                            }
                          />
                        </>
                      ) : null}
                    </>
                  ) : null}
                </>
              ) : null}
            </div>
            {/* END Recurrence */}

            <DateInputComponent
              label="Schedule Start Date"
              name="startDate"
              inputStyle={'border-gray-200'}
              hasError={formik.touched.startDate && !!formik.errors.startDate}
              errorMessage={formik.errors.startDate}
              fieldProps={{
                showTime: { format: 'HH:mm' },
                format: {
                  format: 'MMM Do, YYYY HH:mm a',
                },
                disabled:
                  meeting &&
                  formik.values.recurrence?.isChecked &&
                  formik.values.recurrence?.frequency === 'custom'
                    ? true
                    : false,
                value: formik.values.startDate
                  ? dayjs.utc(formik.values.startDate)
                  : // .tz(
                    //   (timezone as ITimezoneOption).value
                    // )
                    undefined,
                onChange(date) {
                  formik.setFieldValue(
                    'startDate',
                    dayjs
                      .utc(date)
                      // .tz((timezone as ITimezoneOption).value)
                      .toISOString()
                  );
                },
                // onBlur: formik.handleBlur,
                status:
                  formik.touched.startDate && Boolean(formik.errors.startDate)
                    ? 'error'
                    : undefined,
                use12Hours: true,
                showNow: false,
                allowClear: false,
                // changeOnBlur: true,
                // needConfirm: false,
                disabledDate: (curr) =>
                  disabledDate(curr, formik.values.timezone) as boolean,
                // showSecond: false,
                renderExtraFooter: () => (
                  // <SelectComponent
                  //   label="Timezone"
                  //   placeholder="Timezone"
                  //   name="timezone"
                  //   field={{
                  //     options: timezones.map((tz) => ({
                  //       label: tz,
                  //       value: tz,
                  //     })),
                  //     className: 'my-2',
                  //     value: timezone,
                  //     onChange: (value) => {
                  //       setTimezone(value);
                  //     },
                  //   }}
                  // />
                  // <TimezoneSelect
                  //   value={timezone}
                  //   onChange={setTimezone}
                  //   maxMenuHeight={300}
                  //   menuPlacement="top"
                  //   // remove select focus outline
                  //   className="z-50 !outline-none !*:border-none"
                  //   timezones={getAllTimezones()}
                  // />
                  <div className="mt-1">
                    <SelectTimezone
                      value={
                        formik.values.timezone ? formik.values.timezone : ''
                      }
                      placeholder={'Select Timezone'}
                      label="Select Timezone"
                      onChange={(value) => {
                        formik.setFieldValue('timezone', value);
                      }}
                      optionFilterProp="label"
                      showSearch
                    />
                  </div>
                ),
              }}
            />

            {/* <Description title="Note: The duration of the meeting cannot be more than 40 minutes" /> */}
          </div>
          <div className="flex justify-end px-6 py-2 space-x-2">
            <WhiteButton
              text="Cancel"
              className="!w-28"
              onClick={handleCloseModal}
            />
            <CustomButton
              text="Schedule"
              className="!w-28"
              type="submit"
              loadingText="Scheduling"
              isLoading={isScheduling}
            />
          </div>
        </form>
      </div>
    </ModalComponent>
  );
}
