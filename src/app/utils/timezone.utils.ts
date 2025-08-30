import { getTimeZones } from '@vvo/tzdb';
import moment from 'moment';

export type ITimezoneOption = {
  value: string;
  label: string;
  abbrev: string;
  altName: string;
  offset: number;
};

export class Timezone {
  static get timezones() {
    const timeZones = getTimeZones();

    return timeZones.map((tz) => {
      // Calculate GMT offset in hours
      const hoursOffset = tz.currentTimeOffsetInMinutes / 60;
      const gmtLabel = `GMT${hoursOffset >= 0 ? `+${hoursOffset}` : hoursOffset}`;

      // Join the main cities to display in the label
      const cities = tz.mainCities.join(', ');

      return {
        value: tz.name,
        label: `(${gmtLabel} ${tz.abbreviation}) ${cities}`,
        abbrev: tz.abbreviation,
        altName: tz.alternativeName,
        offset: tz.currentTimeOffsetInMinutes,
      };
    });
  }

  static getByValue(value: string) {
    return Timezone.timezones.find((tz) => tz.value === value);
  }
}

export function getTimesBy30MinutesGapUpToMidNight(currentTime: Date) {
  const times: string[] = [];
  const now = moment();
  const inputTime = moment(currentTime);

  // Check if the input date is after today
  if (inputTime.isAfter(now, 'day')) {
    // Set start time to 12:00 AM of the input date
    inputTime.startOf('day');
  } else {
    // Round up to the next 30-minute mark
    const remainder = 30 - (inputTime.minute() % 30);
    if (remainder !== 30) {
      inputTime.add(remainder, 'minutes');
    }
    // Set seconds and milliseconds to zero
    inputTime.seconds(0).milliseconds(0);
  }

  const endTime = moment(inputTime).endOf('day');

  while (inputTime.isBefore(endTime)) {
    times.push(inputTime.format('hh:mmA'));
    inputTime.add(30, 'minutes');
  }

  return times;
}
