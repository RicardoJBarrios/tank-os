import { createVitestConfig } from '../../tools/testing/vitest-config';

export default createVitestConfig({
  projectName: 'aquarium-firestore',
  root: __dirname,
  angular: false,
  staticCopy: false,
});
