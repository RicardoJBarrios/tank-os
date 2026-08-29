import { isZodExternalMessage } from './is-zod-external-message';

it.each([
  ['message', true],
  [1, true],
  [false, true],
  [1n, true],
  [null, false],
  [{}, false],
  [new Error(), false],
] as const)('narrows external message %s', (value, expected) => {
  expect(isZodExternalMessage(value)).toBe(expected);
});
