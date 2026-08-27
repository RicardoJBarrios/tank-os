import { createVitestConfig } from '../../tools/testing/vitest-config';

export default createVitestConfig({
  projectName: 'aquarium-ui',
  root: __dirname,
  inlineAngularDependencies: true,
});
