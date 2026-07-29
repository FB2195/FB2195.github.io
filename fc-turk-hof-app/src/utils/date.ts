const WEEKDAYS_SHORT = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const MONTH_NAMES = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
];
const WEEKDAY_NAMES = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

export const parseISODate = (iso: string): Date => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const formatDateLong = (iso: string): string => {
  const date = parseISODate(iso);
  return `${WEEKDAY_NAMES[date.getDay()]}, ${date.getDate()}. ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
};

export const formatDateShort = (iso: string): string => {
  const date = parseISODate(iso);
  return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
};

export const formatDayMonth = (iso: string): string => {
  const date = parseISODate(iso);
  return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.`;
};

export const monthLabel = (year: number, month: number): string => `${MONTH_NAMES[month]} ${year}`;

export const toISODate = (year: number, month: number, day: number): string =>
  `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

/** Erzeugt eine Wochen/Tage-Matrix (Mo-So) für den gegebenen Monat, inkl. Fülltage aus Nachbarmonaten. */
export const buildMonthGrid = (year: number, month: number): { iso: string; inMonth: boolean }[] => {
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingEmpty = (firstOfMonth.getDay() + 6) % 7; // Montag = 0

  const cells: { iso: string; inMonth: boolean }[] = [];

  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = leadingEmpty - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const d = new Date(year, month - 1, day);
    cells.push({ iso: toISODate(d.getFullYear(), d.getMonth(), d.getDate()), inMonth: false });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ iso: toISODate(year, month, day), inMonth: true });
  }

  while (cells.length % 7 !== 0) {
    const last = parseISODate(cells[cells.length - 1].iso);
    const next = new Date(last);
    next.setDate(last.getDate() + 1);
    cells.push({ iso: toISODate(next.getFullYear(), next.getMonth(), next.getDate()), inMonth: false });
  }

  return cells;
};

export const WEEKDAYS_HEADER = WEEKDAYS_SHORT;

export const formatTimeRange = (time: string, endTime?: string): string =>
  endTime ? `${time} – ${endTime} Uhr` : `${time} Uhr`;
