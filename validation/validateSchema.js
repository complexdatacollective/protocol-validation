const schemas = require('../schemas/');

const getVersion = version =>
  schemas.find(({ version: _version }) => _version === version);

/**
 * Statically validate the protocol based on its JSON schema
 */
const validateSchema = (protocol, supportedVersions = ['1.0.0']) => {
  // Check protocol matches version specified
  if (!supportedVersions.includes(protocol.schemaVersion)) {
    return [new Error(`Protocol schema version ${JSON.stringify(protocol.schemaVersion)} does not match any supported by application: ${JSON.stringify(supportedVersions)}`)];
  }

  // Check resultant version exists
  const version = getVersion(protocol.schemaVersion);

  if (!version) {
    return [new Error(`Provided schema version '${protocol.schemaVersion}' is not defined`)];
  }

  // Validate
  const validate = version.schema;
  validate(protocol, 'Protocol');
  return validate.errors || [];
};

module.exports = validateSchema;
