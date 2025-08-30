import { Calendar, Radio, Spin } from 'antd';
import SenaryHeading from '@/app/component/headings/senaryHeading';
import { InputComponent } from '@/app/component/customInput/Input';
import dayjs from 'dayjs';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import type { FormikProps } from 'formik';
import {
  IBookingDemo,
  IBookingDemoForm,
} from '@/app/interfaces/booking-demo.interface';
import { SelectTimezone } from '@/app/component/customSelect/SelectTimezone';
import {
  Timezone,
  getTimesBy30MinutesGapUpToMidNight,
} from '@/app/utils/timezone.utils';
import moment from 'moment';
import { toast } from 'react-toastify';
import { LoadingOutlined } from '@ant-design/icons';
import _ from 'lodash';

type Props = {
  formik: FormikProps<IBookingDemoForm>;
  isLoadingBookings?: boolean;
  list: IBookingDemo[];
};

export function ChooseTime({ formik, isLoadingBookings, list }: Props) {
  function isTimeBooked(time: string): boolean {
    return _.find(list, (item) => item.time === time) !== undefined;
  }

  return (
    <div className="grid grid-cols-1 mt-4 md:grid-cols-2 gap-5">
      {/* calendar */}
      <div className="space-y-2">
        <SenaryHeading
          title="Pick your date"
          className="text-base font-medium text-schestiPrimaryBlack"
        />

        <Calendar
          fullscreen={false}
          headerRender={(props) => {
            return (
              <div className="space-y-2 py-2">
                <InputComponent
                  label=""
                  name=""
                  type="text"
                  field={{
                    value: dayjs(props.value).format('DD-MM-YYYY'),
                  }}
                />

                <div className="flex justify-between items-center">
                  <IoIosArrowBack
                    className="text-2xl cursor-pointer"
                    onClick={() => {
                      if (dayjs(props.value).isBefore(dayjs())) {
                        return;
                      }

                      props.onChange(dayjs(props.value).add(-1, 'month'));
                    }}
                  />
                  <SenaryHeading
                    title={`${dayjs(props.value).format('MMMM YYYY')}`}
                    className="text-sm font-medium text-schestiPrimaryBlack"
                  />
                  <IoIosArrowForward
                    className="text-2xl cursor-pointer"
                    onClick={() => {
                      props.onChange(dayjs(props.value).add(1, 'month'));
                    }}
                  />
                </div>
              </div>
            );
          }}
          disabledDate={(current) => {
            return current && current < dayjs().subtract(1, 'day');
          }}
          value={formik.values.date ? dayjs(formik.values.date) : undefined}
          onChange={(date) => {
            formik.setFieldValue('date', date ? date.toISOString() : null);
          }}
        />
      </div>

      {/* Slots */}
      <div className="border border-schestiPrimary p-3 rounded-lg space-y-3">
        <div className="flex items-center gap-3">
          <SenaryHeading
            title="Demo Duration"
            className="text-sm font-medium text-schestiPrimaryBlack"
          />
          <p className="text-center p-2 rounded-full bg-schestiLightBlack text-white text-xs">
            30 Mins
          </p>
        </div>

        <div className="flex items-center gap-2">
          <SenaryHeading
            title="Showing times for:"
            className="text-sm font-normal text-schestiPrimaryBlack"
          />

          <SenaryHeading
            title={`${moment(formik.values.date).format('MMMM DD, YYYY')}`}
            className="text-sm font-semibold text-schestiPrimaryBlack"
          />
        </div>

        <SenaryHeading
          title="What time works best?"
          className="text-sm font-normal text-schestiPrimaryBlack"
        />

        <div className="w-56">
          <SelectTimezone
            label={
              formik.values.timezone
                ? formik.values.timezone.label
                : 'Select Timezone'
            }
            value={formik.values.timezone ? formik.values.timezone : ''}
            placeholder={'Select Timezone'}
            onChange={(value) => {
              formik.setFieldValue('timezone', Timezone.getByValue(value));
            }}
            optionFilterProp="label"
            showSearch
            dropdownStyle={{
              width: 500,
            }}
          />
        </div>

        <SenaryHeading
          title="What time works best?"
          className="text-sm font-normal text-schestiPrimaryBlack"
        />

        <Spin spinning={isLoadingBookings} indicator={<LoadingOutlined spin />}>
          <div
            className={`flex flex-wrap gap-4 h-[150px] overflow-y-scroll p-2 rounded-md ${formik.touched.time && formik.errors.time ? 'border border-red-500' : ''}`}
          >
            {getTimesBy30MinutesGapUpToMidNight(
              moment(formik.values.date).toDate()
            ).map((time) => {
              return (
                <div
                  key={time}
                  className="p-2 border flex items-center gap-1 border-schestiPrimary rounded-full cursor-pointer"
                >
                  <Radio
                    checked={formik.values.time === time || isTimeBooked(time)}
                    onChange={() => {
                      const timeObj = moment(time, 'hh:mmA');
                      const dayObj = moment(formik.values.date);
                      timeObj.set({
                        date: dayObj.toDate().getTime(),
                      });
                      if (moment(timeObj, 'hh:mmA').isBefore(moment())) {
                        toast.error('Please select a future time');
                        return;
                      }

                      formik.setFieldValue('time', time);
                    }}
                    disabled={isTimeBooked(time)}
                  />
                  <SenaryHeading
                    title={time}
                    className={`text-schestiPrimary ${isTimeBooked(time) ? 'opacity-50 line-through' : ''}`}
                  />
                </div>
              );
            })}
          </div>
          {formik.touched.time && formik.errors.time && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.time}</p>
          )}
        </Spin>
      </div>
    </div>
  );
}
