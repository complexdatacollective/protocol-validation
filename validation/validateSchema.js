const schemas = require('../schemas/');

const getSchema = version =>
  schemas.find(({ version: _version }) => _version === version);

/**
 * Statically validate the protocol based on JSON schema
 */
const validateSchema = (protocol, forceVersion) => {
  if (forceVersion) {
    console.log(`Forcing validation against schema version ${forceVersion}`);
  }

  const version = forceVersion || protocol.schemaVersion;
  const schema = getSchema(version);

  // Check resultant version exists
  if (!schema) {
    return [new Error(`Provided schema version '${version}' is not defined`)];
  }

  // Validate
  const validator = schema.validator;
  validator(protocol, 'Protocol');
  return validator.errors || [];
};

module.exports = validateSchema;
