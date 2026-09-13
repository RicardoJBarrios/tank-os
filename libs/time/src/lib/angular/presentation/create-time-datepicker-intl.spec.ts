import { createTimeDatepickerIntl } from './create-time-datepicker-intl';

it('provides the localized Material calendar labels without shared mutable state', () => {
  const intl = createTimeDatepickerIntl();
  expect(intl.openCalendarLabel).toBe('Abrir calendario');
  expect(intl.closeCalendarLabel).toBe('Cerrar calendario');
  expect(intl.prevMonthLabel).toBe('Mes anterior');
  expect(intl.nextMonthLabel).toBe('Mes siguiente');
  expect(intl.switchToMultiYearViewLabel).toBe('Elegir año');
  expect(intl).not.toBe(createTimeDatepickerIntl());
});
