import { createVitestConfig } from '../../tools/testing/vitest-config';

export default createVitestConfig({
  projectName: 'decimal-angular',
  root: __dirname,
  inlineAngularDependencies: true,
});
