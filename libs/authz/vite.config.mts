import { createVitestConfig } from '../../tools/testing/vitest-config';

export default createVitestConfig({
  projectName: 'authz',
  root: __dirname,
  angular: false,
  staticCopy: false,
  aliases: {
    '@tankos/authn': '../authn/src/index.ts',
  },
});
