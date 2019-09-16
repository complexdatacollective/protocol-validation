/* eslint-env jest */

const validateSchema = require('../validateSchema');
const schemas = require('../../schemas');

jest.mock('../../schemas');

const validator_1 = jest.fn(() => ([]));
const validator_2 = jest.fn(() => ([]));

schemas.push({ version: '1', validator: validator_1 });
schemas.push({ version: '2', validator: validator_2 });

const getProtocol = mergeProps => ({
  schemaVersion: 1,
  ...mergeProps,
});

describe('validateSchema', () => {
  it('ensures protocol schema is defined', () => {
    const expectedError = new Error("Provided schema version '__foo__' is not defined");

    expect(validateSchema(getProtocol({ schemaVersion: '__foo__' })))
      .toEqual([expectedError]);
  });

  it('it validates against schema version defined in protocol', () => {
    validator_1.mockReset();
    expect(validator_1.mock.calls).toEqual([]);
    validateSchema(getProtocol({ schemaVersion: '1' }));
    expect(validator_1.mock.calls).toEqual([[{ 'schemaVersion': '1' }, 'Protocol']]);
  });

  it('it validates against specified schema version', () => {
    validator_2.mockReset();
    expect(validator_2.mock.calls).toEqual([]);
    validateSchema(getProtocol({ schemaVersion: '1' }), '2');
    expect(validator_2.mock.calls).toEqual([[{ 'schemaVersion': '1' }, 'Protocol']]);
  });
});
