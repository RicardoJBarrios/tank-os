import { createVitestConfig } from '../../tools/testing/vitest-config';

export default createVitestConfig({
  projectName: 'aquarium',
  root: __dirname,
  angular: false,
  staticCopy: false,
});
