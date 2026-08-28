import { createVitestConfig } from '../../tools/testing/vitest-config';

export default createVitestConfig({
  projectName: 'shell-ui',
  root: __dirname,
  inlineAngularDependencies: true,
});
