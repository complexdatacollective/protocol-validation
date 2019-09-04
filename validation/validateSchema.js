const schemas = require('../schemas/');

const getVersion = version =>
  schemas.find(({ version: _version }) => _version === version);

/**
 * Statically validate the protocol based on JSON schema
 */
const validateSchema = (protocol, forceVersion = false, supportedVersions = false) => {
  // If supportedVersions is supplied, check protocol matches version specified
  if (supportedVersions && !supportedVersions.includes(protocol.schemaVersion)) {
    return [new Error(`Protocol schema version ${JSON.stringify(protocol.schemaVersion)} does not match any supported by application: ${JSON.stringify(supportedVersions)}`)];
  }

  if (forceVersion) {
    console.log(`Forcing validation against schema version ${forceVersion}`);
  }

  const versionToValidate = forceVersion || protocol.schemaVersion;
  const version = getVersion(versionToValidate);

  // Check resultant version exists
  if (!version) {
    return [new Error(`Provided schema version '${versionToValidate}' is not defined`)];
  }

  // Validate
  const validate = version.schema;
  validate(protocol, 'Protocol');
  return validate.errors || [];
};

module.exports = validateSchema;
