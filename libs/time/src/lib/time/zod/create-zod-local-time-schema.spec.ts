import { createZodLocalTimeSchema } from './create-zod-local-time-schema';

it('parses external civil clock strings and rejects invalid representations', () => {
  const schema = createZodLocalTimeSchema();
  expect(schema.parse('12:30')).toEqual({
    kind: 'local-time',
    hour: 12,
    minute: 30,
    second: 0,
    millisecond: 0,
  });
  for (const value of ['24:00', 123, {}, null])
    expect(schema.safeParse(value).success).toBe(false);
});
