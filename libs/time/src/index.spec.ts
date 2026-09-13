import * as publicApi from './index';

describe('main entry point', () => {
  it('exports semantic helpers and canonical Zod schemas', () => {
    expect(publicApi.createZodTimeSchemas).toEqual(expect.any(Function));
    expect(publicApi.isValidCalendarDate).toEqual(expect.any(Function));
    expect(publicApi.parseLocalTime).toEqual(expect.any(Function));
    expect(publicApi.toLocalTimeString).toEqual(expect.any(Function));
  });

  it('does not select a runtime, Angular integration or transport', () => {
    expect(publicApi).not.toHaveProperty('createLuxonTimeAdapter');
    expect(publicApi).not.toHaveProperty('provideTimeAngular');
    expect(publicApi).not.toHaveProperty('TimeField');
    expect(publicApi).not.toHaveProperty('createFirestoreTimeAdapter');
  });
});
