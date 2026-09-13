import * as publicApi from './index';

describe('Units Firestore public entry point', () => {
  it('Given the public entry point, When imported, Then exposes the unit-definition repository', () => {
    expect(publicApi.createUnitDefinitionFirestoreRepository).toBeTypeOf(
      'function',
    );
  });
});
