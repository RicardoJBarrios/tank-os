import { createAngularEslintConfig } from '../../tools/eslint/angular-profiles.mjs';
import { createVitestEslintConfig } from '../../tools/eslint/vitest-profiles.mjs';

export default [
  ...createAngularEslintConfig({ prefix: 'tankos' }),
  ...createVitestEslintConfig(),
  {
    files: ['src/**/*.ts'],
    ignores: ['src/**/*.spec.ts', 'src/**/*.test.ts'],
    rules: {
      'no-restricted-globals': [
        'error',
        { name: 'Date', message: 'The time core must be runtime-neutral.' },
        { name: 'Intl', message: 'The time core must be runtime-neutral.' },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@angular/*', 'firebase', 'firebase/*'],
              message: 'The time core cannot depend on Angular or Firebase.',
            },
          ],
        },
      ],
    },
  },
];
