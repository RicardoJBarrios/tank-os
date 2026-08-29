import { RuleTester } from 'eslint';
import { describe, it } from 'vitest';

import rule from './one-exported-callable-per-file.mjs';

describe('one-exported-callable-per-file', () => {
  const ruleTester = new RuleTester({
    languageOptions: { ecmaVersion: 2022, sourceType: 'module' },
  });

  it('allows barrels and one callable but rejects additional declarations', () => {
    ruleTester.run('one-exported-callable-per-file', rule, {
      valid: [
        "export { parseInstant } from './parse-instant.js';",
        'export function parseInstant(value) { return value; }',
        'export class TimeService {}',
      ],
      invalid: [
        {
          code: 'export function first() {} export function second() {}',
          errors: [{ messageId: 'oneCallable' }],
        },
        {
          code: 'export class First {} export class Second {}',
          errors: [{ messageId: 'oneCallable' }],
        },
        {
          code: 'export function first() {} export class Second {}',
          errors: [{ messageId: 'oneCallable' }],
        },
        {
          code: 'function helper() {} export function parseInstant(value) { return helper(value); }',
          errors: [{ messageId: 'oneCallable' }],
        },
      ],
    });
  });
});
