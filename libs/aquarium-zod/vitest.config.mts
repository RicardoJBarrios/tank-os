import { createVitestConfig } from '../../tools/testing/vitest-config';

export default createVitestConfig({
  projectName: 'aquarium-zod',
  root: __dirname,
  angular: false,
  staticCopy: false,
});
