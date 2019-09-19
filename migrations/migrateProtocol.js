const getMigrationPath = require('./getMigrationPath');
const MigrationStepError = require('./errors').MigrationStepError;

const migrateStep = (protocol, { version, migration }) => {
  try {
    return migration(protocol);
  } catch (e) {
    throw new MigrationStepError(version, e);
  }
};

const migrateProtocol = (protocol, targetSchemaVersion) => {
  // Get migration steps between versions
  const migrationPath = getMigrationPath(protocol.schemaVersion, targetSchemaVersion);

  // Perform migration
  const updatedProtocol = migrationPath.reduce(migrateStep, protocol);

  return {
    ...updatedProtocol,
    schemaVersion: targetSchemaVersion,
  };
};

module.exports = migrateProtocol;
