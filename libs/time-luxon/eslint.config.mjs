import { createAngularEslintConfig } from '../../tools/eslint/angular-profiles.mjs';
import { createVitestEslintConfig } from '../../tools/eslint/vitest-profiles.mjs';

export default [
  ...createAngularEslintConfig({ prefix: 'tankos' }),
  ...createVitestEslintConfig(),
  {
    files: ['src/**/*.ts'],
    ignores: ['src/**/*.spec.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@tankos/time/*', '@angular/*', 'firebase', 'firebase/*'],
              message: 'The runtime implements only the neutral Time contract.',
            },
          ],
        },
      ],
    },
  },
];
