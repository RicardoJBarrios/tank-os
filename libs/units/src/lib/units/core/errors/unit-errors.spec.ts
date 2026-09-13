import { UnitCodeError, UnitError } from './unit-errors';

describe('unit errors', () => {
  it('Given a unit error, When created, Then exposes its stable code', () => {
    const error = new UnitError('TEST', 'message');

    expect(error).toMatchObject({
      name: 'UnitError',
      code: 'TEST',
      message: 'message',
    });
  });

  it('Given an invalid code, When represented, Then identifies the failure', () => {
    const error = new UnitCodeError('bad code');

    expect(error).toMatchObject({
      name: 'UnitCodeError',
      code: 'UNIT_CODE_INVALID',
    });
  });
});
