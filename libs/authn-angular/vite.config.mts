import { createVitestConfig } from '../../tools/testing/vitest-config';

export default createVitestConfig({
  projectName: 'authn-angular',
  root: __dirname,
  staticCopy: false,
  aliases: {
    '@tankos/authn': '../authn/src/index.ts',
  },
});
