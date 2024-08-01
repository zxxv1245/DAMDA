// date.ts
function getDateWithSeparator(dateString: Date | string, separator: string = '') {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return [
    String(year),
    String(month).padStart(2, '0'),
    String(day).padStart(2, '0')
  ].join(separator);
}

function getMonthYearDetails(initialDate: Date) {
  const month = initialDate.getMonth() + 1;
  const year = initialDate.getFullYear();
  const startDate = new Date(`${year}-${month}`);
  const firstDOW = startDate.getDay();
  const lastDateString = String(
    new Date(
      initialDate.getFullYear(),
      initialDate.getMonth() + 1,
      0,
    ).getDate(),
  );
  const lastDate = Number(lastDateString);

  return { month, year, startDate, firstDOW, lastDate };
}

type MonthYear = {
  month: number;
  year: number;
  startDate: Date;
  firstDOW: number;
  lastDate: number;
};

function getNewMonthYear(prevData: MonthYear, increment: number) {
  const newMonthYear = new Date(
    prevData.startDate.setMonth(prevData.startDate.getMonth() + increment),
  )

  return getMonthYearDetails(newMonthYear);
}

function isSameAsCurrentDate(year: number, month: number, date: number) {
  const currentDate = getDateWithSeparator(new Date());
  const inputDate = `${year}${String(month).padStart(2, '0')}${String(date).padStart(2, '0')}`;

  return currentDate === inputDate;
}

function formatDateWithDay(date: Date): string {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const dayOfWeek = days[date.getDay()];
  const day = date.getDate();
  return `${day}일 ${dayOfWeek}요일`;
}

export { getMonthYearDetails, getNewMonthYear, getDateWithSeparator, isSameAsCurrentDate, formatDateWithDay };

export type { MonthYear };
