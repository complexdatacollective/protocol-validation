const schemas = require('../schemas/');

/**
 * Statically validate the protocol based on its JSON schema
 */
const validateSchema = (protocol, version = '1') => {
  // Check protocol matches version specified
  if (protocol.schemaVersion !== version) {
    return [new Error(`Schema version '${version}' provided does not match protocol schema version '${protocol.schemaVersion}'`)];
  }

  // Check resultant version exists
  if (!schemas[version]) {
    return [new Error(`Provided schema version '${version}' is not defined`)];
  }

  // Validate
  const validate = schemas[version];
  validate(protocol, 'Protocol');
  return validate.errors || [];
};

module.exports = validateSchema;
