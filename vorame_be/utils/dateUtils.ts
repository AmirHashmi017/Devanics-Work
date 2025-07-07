import moment from 'moment';

export const isDateInPast = (date: string) => {
  const dateMoment = moment(date);
  const currentMoment = moment();

  if (dateMoment.isBefore(currentMoment) || dateMoment.isSame(currentMoment)) {
    return true;
  } else {
    return false;
  }
};
