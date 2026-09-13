import * as publicApi from './index';

describe('TankOS Data Access public entry point', () => {
  it('exposes only the provider-neutral persistence kernel', () => {
    expect(publicApi.createEntityId).toEqual(expect.any(Function));
    expect(publicApi.createCrudService).toEqual(expect.any(Function));
    expect(publicApi.createMutationMetadata).toEqual(expect.any(Function));
    expect('createBatchService' in publicApi).toBe(false);
    expect('provideTankOsDataAccess' in publicApi).toBe(false);
  });
});
