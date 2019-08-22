/* eslint-env jest */

const validateSchema = require('../validateSchema');
const schemas = require('../../schemas');

jest.mock('../../schemas');

const getProtocol = mergeProps => ({
  schemaVersion: 1,
  ...mergeProps,
});

describe('validateSchema', () => {
  it('ensures protocol schema matches specified versions', () => {
    const expectedError = new Error("Protocol schema version '2' does not match any supported by application: [1]");

    expect(validateSchema(getProtocol({ schemaVersion: 1 }), [1, 2, 3])).toEqual([]);
    expect(validateSchema(getProtocol({ schemaVersion: 2 }), [1])).toEqual([expectedError]);
  });

  it('ensures protocol schema is defined', () => {
    const schema = schemas[1];
    delete schemas[1];
    const expectedError = new Error("Provided schema version '1' is not defined");

    expect(validateSchema(getProtocol({ schemaVersion: 1 }), [1])).toEqual([expectedError]);
    schemas[1] = schema;
  });

  it('vaidates schema against version defined in protocol', () => {
    schemas[1].mockReset();
    expect(schemas[1].mock.calls).toEqual([]);
    validateSchema(getProtocol({ schemaVersion: 1 }), [1]);
    expect(schemas[1].mock.calls).toEqual([[{ 'schemaVersion': 1 }, 'Protocol']]);
  });
});
