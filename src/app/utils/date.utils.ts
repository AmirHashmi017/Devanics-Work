import Dayjs, { type Dayjs as DayjsType } from 'dayjs';
import timezone from 'dayjs/plugin/timezone'; // dependent on utc plugin
import utc from 'dayjs/plugin/utc';
import moment from 'moment-timezone';

const dayjs = Dayjs;

dayjs.extend(utc);
// see: https://dayjs.gitee.io/docs/zh-CN/plugin/timezone
dayjs.extend(timezone);

export { dayjs };
export const disabledDate = (current: DayjsType, timezone = 'Asia/Karachi') => {
  if (current) {
    return current.isBefore(dayjs().tz(timezone).startOf('day'), 'day');
  }
};

export function getClientLocalTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function getTimezoneFromCountryAndState(
  countryCode: string,
  stateCode: string
) {
  const countryStateCode = countryCode + '/' + stateCode;
  const zones = moment.tz.zonesForCountry(countryCode);
  for (const zone of zones) {
    if (zone.includes(countryStateCode)) {
      return zone;
    }
  }
  return zones[0];
}

// Function to get timezone details

// Get Date Range from string
// The string can be equal to "lastWeek" | "lastMonth" | "lastYear" | "currentYear"
export const getRangeFromDateString = (
  value?: 'lastWeek' | 'lastMonth' | 'lastYear' | 'currentYear'
): undefined | [string, string, string, string] => {
  if (!value) {
    return undefined;
  }

  if (value === 'lastWeek') {
    const lastWeekStart = moment().subtract(1, 'week').startOf('week');
    const lastWeekEnd = moment().subtract(1, 'week').endOf('week');
    const currentWeekStart = moment().startOf('week');
    const currentWeekEnd = moment().endOf('week');
    return [
      lastWeekStart.toDate().toLocaleDateString(),
      lastWeekEnd.toDate().toLocaleDateString(),
      currentWeekStart.toDate().toLocaleDateString(),
      currentWeekEnd.toDate().toLocaleDateString(),
    ];
  } else if (value === 'lastMonth') {
    const lastMonthStart = moment().subtract(1, 'month').startOf('month');
    const lastMonthEnd = moment().subtract(1, 'month').endOf('month');
    const currentMonthStart = moment().startOf('month');
    const currentMonthEnd = moment().endOf('month');
    return [
      lastMonthStart.toDate().toLocaleDateString(),
      lastMonthEnd.toDate().toLocaleDateString(),
      currentMonthStart.toDate().toLocaleDateString(),
      currentMonthEnd.toDate().toLocaleDateString(),
    ];
  } else if (value === 'lastYear') {
    const lastYearStart = moment().subtract(1, 'year').startOf('year');
    const lastYearEnd = moment().subtract(1, 'year').endOf('year');
    const currentYearStart = moment().startOf('year');
    const currentYearEnd = moment().endOf('year');
    return [
      lastYearStart.toDate().toLocaleDateString(),
      lastYearEnd.toDate().toLocaleDateString(),
      currentYearStart.toDate().toLocaleDateString(),
      currentYearEnd.toDate().toLocaleDateString(),
    ];
  } else if (value === 'currentYear') {
    const currentYearStart = moment().startOf('year');
    const currentYearEnd = moment().endOf('year');
    return [
      currentYearStart.toDate().toLocaleDateString(),
      currentYearEnd.toDate().toLocaleDateString(),
      currentYearStart.toDate().toLocaleDateString(),
      currentYearEnd.toDate().toLocaleDateString(),
    ];
  } else {
    return undefined;
  }
};
