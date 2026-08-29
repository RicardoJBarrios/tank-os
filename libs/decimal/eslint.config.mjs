import { createAngularEslintConfig } from '../../tools/eslint/angular-profiles.mjs';
import { createVitestEslintConfig } from '../../tools/eslint/vitest-profiles.mjs';

export default [
  ...createAngularEslintConfig({ prefix: 'tankos' }),
  ...createVitestEslintConfig(),
  {
    files: ['src/**/*.ts'],
    ignores: ['src/**/*.spec.ts', 'src/**/*.test.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@angular/*', 'firebase', 'firebase/*'],
              message:
                'The decimal core cannot depend on Angular or Firebase.',
            },
          ],
        },
      ],
      'no-restricted-globals': [
        'error',
        {
          name: 'Intl',
          message: 'The decimal core must remain presentation-neutral.',
        },
      ],
    },
  },
];
