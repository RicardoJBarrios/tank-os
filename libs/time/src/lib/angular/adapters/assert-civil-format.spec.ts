import { assertCivilFormat } from './assert-civil-format';

describe('civil format semantics', () => {
  it.each([
    'shortDate',
    'mediumDate',
    'longDate',
    'fullDate',
    "yyyy-MM-dd 'at'",
    'EEEE',
  ])('accepts date format %s', (format) => {
    expect(() => {
      assertCivilFormat(format, 'date');
    }).not.toThrow();
  });
  it.each(['shortTime', 'mediumTime', 'HH:mm:ss.SSS', "h:mm a 'hours'"])(
    'accepts clock format %s',
    (format) => {
      expect(() => {
        assertCivilFormat(format, 'time');
      }).not.toThrow();
    },
  );
  it.each(['longTime', 'fullTime', 'yyyy-MM-dd', 'HH:mm z'])(
    'rejects invented clock fields %s',
    (format) => {
      expect(() => {
        assertCivilFormat(format, 'time');
      }).toThrow(RangeError);
    },
  );
  it.each(['short', 'medium', 'HH:mm', 'yyyy Z'])(
    'rejects invented date fields %s',
    (format) => {
      expect(() => {
        assertCivilFormat(format, 'date');
      }).toThrow(RangeError);
    },
  );
});
