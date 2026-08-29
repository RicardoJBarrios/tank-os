import { createVitestConfig } from '../../tools/testing/vitest-config';

export default createVitestConfig({
  projectName: 'decimal',
  root: __dirname,
  angular: false,
  setupFiles: false,
  aliases: {
    '@tankos/decimal': 'src/index.ts',
  },
});
