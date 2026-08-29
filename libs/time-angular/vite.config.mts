import { createVitestConfig } from '../../tools/testing/vitest-config';

export default createVitestConfig({
  projectName: 'time-angular',
  root: __dirname,
  inlineAngularDependencies: true,
});
