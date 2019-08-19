const schemas = require('../schemas/');

/**
 * Statically validate the protocol based on its JSON schema
 */
const validateSchema = (protocol, versions = [1]) => {
  // Check protocol matches version specified
  if (versions.includes(protocol.schemaVersion)) {
    return [new Error(`Protocol schema version '${protocol.schemaVersion}' does not match any supported by application: ${JSON.stringify(versions)}`)];
  }

  // Check resultant version exists
  if (!schemas[protocol.schemaVersion]) {
    return [new Error(`Provided schema version '${protocol.schemaVersion}' is not defined`)];
  }

  // Validate
  const validate = schemas[protocol.schemaVersion];
  validate(protocol, 'Protocol');
  return validate.errors || [];
};

module.exports = validateSchema;
