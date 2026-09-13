import { MatDatepickerIntl } from '@angular/material/datepicker';

declare const $localize: (
  messageParts: TemplateStringsArray,
  ...expressions: readonly unknown[]
) => string;

/** Localizes Material's calendar controls with Angular's application catalog. */
export function createTimeDatepickerIntl(): MatDatepickerIntl {
  return Object.assign(new MatDatepickerIntl(), {
    calendarLabel: $localize`:@@time.calendar:Calendario`,
    openCalendarLabel: $localize`:@@time.openCalendar:Abrir calendario`,
    closeCalendarLabel: $localize`:@@time.closeCalendar:Cerrar calendario`,
    prevMonthLabel: $localize`:@@time.prevMonth:Mes anterior`,
    nextMonthLabel: $localize`:@@time.nextMonth:Mes siguiente`,
    prevYearLabel: $localize`:@@time.prevYear:Año anterior`,
    nextYearLabel: $localize`:@@time.nextYear:Año siguiente`,
    prevMultiYearLabel: $localize`:@@time.prevYears:Años anteriores`,
    nextMultiYearLabel: $localize`:@@time.nextYears:Años siguientes`,
    switchToMonthViewLabel: $localize`:@@time.chooseDate:Elegir fecha`,
    switchToMultiYearViewLabel: $localize`:@@time.chooseYear:Elegir año`,
  });
}
