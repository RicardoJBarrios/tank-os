import * as publicApi from './index';

describe('Units public entry point', () => {
  it('Given the public entry point, When imported, Then exposes unit code creation', () => {
    expect(publicApi.createUnitCode).toBeTypeOf('function');
  });

  it('Given the public entry point, When imported, Then exposes unit definition creation', () => {
    expect(publicApi.createUnitDefinition).toBeTypeOf('function');
  });

  it('Given the public entry point, When imported, Then exposes its canonical Zod boundary', () => {
    expect(publicApi.unitDefinitionDtoSchema).toBeDefined();
    expect(publicApi.unitDefinitionSchema).toBeDefined();
    expect(publicApi.unitDefinitionToDto).toBeTypeOf('function');
  });
});
