import { DayOfWeek } from '@types';
import dayjs from 'dayjs';

export const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const dayOfWeekShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const monthOfYear = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export const monthOfYearShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const isValidDate = (date: Date, time: string, day: DayOfWeek, from: string, to: string) => {
  const maindate = dayjs(date);
  const [mainHour, mainMinute] = time.split(':');
  if (maindate.day() !== dayOfWeek.indexOf(day)) return false;
  const [fromHour, fromMinute] = from.split(':');
  const [toHour, toMinute] = to.split(':');
  if (+mainHour < +fromHour || +mainHour > +toHour) return false;
  if (+mainHour === +fromHour && +mainMinute < +fromMinute) return false;
  if (+mainHour === +toHour && +mainMinute > +toMinute) return false;
  return true;
};

export const isFuture = (date: Date, time: string) => {
  if (dayjs(date).isBefore(dayjs(), 'd')) return true;
  const [hour, minute] = time.split(':');
  if (dayjs(date).isSame(dayjs(), 'd')) {
    if (+hour < dayjs().hour()) return true;
    if (+hour === dayjs().hour() && +minute <= dayjs().minute()) return true;
  }
  return false;
};
