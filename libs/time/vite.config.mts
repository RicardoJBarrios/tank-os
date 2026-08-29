import { createVitestConfig } from '../../tools/testing/vitest-config';

export default createVitestConfig({
  projectName: 'time',
  root: __dirname,
  angular: false,
  setupFiles: false,
});
