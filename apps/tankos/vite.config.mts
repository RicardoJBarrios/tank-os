import { createVitestConfig } from '../../tools/testing/vitest-config';

export default createVitestConfig({
  projectName: 'tankos',
  root: __dirname,
  staticCopy: false,
  aliases: {
    '@tankos/authn': '../../libs/authn/src/index.ts',
    '@tankos/authn-firebase-ui': '../../libs/authn-firebase-ui/src/index.ts',
    '@tankos/authz-angular': '../../libs/authz-angular/src/index.ts',
    '@tankos/aquarium': '../../libs/aquarium/src/index.ts',
    '@tankos/aquarium-firestore': '../../libs/aquarium-firestore/src/index.ts',
    '@tankos/aquarium-ui': '../../libs/aquarium-ui/src/index.ts',
    '@tankos/aquarium-zod': '../../libs/aquarium-zod/src/index.ts',
    '@tankos/data-access': '../../libs/data-access/src/index.ts',
    '@tankos/formatting': '../../libs/formatting/src/index.ts',
    '@tankos/time/angular': '../../libs/time/src/angular.ts',
    '@tankos/time/firestore': '../../libs/time/src/firestore.ts',
    '@tankos/time': '../../libs/time/src/index.ts',
    '@tankos/units-ui': '../../libs/units-ui/src/index.ts',
  },
});
