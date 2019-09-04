/* eslint-env jest */

const validateSchema = require('../validateSchema');
const schemas = require('../../schemas');

jest.mock('../../schemas');

schemas.push({ version: '1', schema: jest.fn(() => ([])) });

const getProtocol = mergeProps => ({
  schemaVersion: 1,
  ...mergeProps,
});

describe('validateSchema', () => {
  it('ensures protocol schema matches specified versions', () => {
    const expectedError = new Error('Protocol schema version "2" does not match any supported by application: ["1"]');

    expect(validateSchema(getProtocol({ schemaVersion: '1' }), ['1', '2', '3'])).toEqual([]);
    expect(validateSchema(getProtocol({ schemaVersion: '2' }), ['1'])).toEqual([expectedError]);
  });

  it('ensures protocol schema is defined', () => {
    const expectedError = new Error("Provided schema version '__foo__' is not defined");

    expect(validateSchema(getProtocol({ schemaVersion: '__foo__' }), ['__foo__'])).toEqual([expectedError]);
  });

  it('vaidates schema against version defined in protocol', () => {
    const schema = schemas.find(({ version }) => version === '1').schema;
    schema.mockReset();
    expect(schema.mock.calls).toEqual([]);
    validateSchema(getProtocol({ schemaVersion: '1' }), ['1']);
    expect(schema.mock.calls).toEqual([[{ 'schemaVersion': '1' }, 'Protocol']]);
  });
});
