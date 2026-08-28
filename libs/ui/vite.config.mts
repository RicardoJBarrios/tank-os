import { createVitestConfig } from '../../tools/testing/vitest-config';

export default createVitestConfig({
  projectName: 'ui',
  root: __dirname,
  angular: false,
  setupFiles: false,
});
