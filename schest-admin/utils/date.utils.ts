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
