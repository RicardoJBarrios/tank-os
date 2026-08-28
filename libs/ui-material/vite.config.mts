import { createVitestConfig } from '../../tools/testing/vitest-config';

export default createVitestConfig({
  projectName: 'ui-material',
  root: __dirname,
  inlineAngularDependencies: true,
});
