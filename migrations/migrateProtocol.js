const getMigrationPath = require('./getMigrationPath');

const migrateStep = (protocol, { migration }) =>
  migration(protocol);

const migrateProtocol = (protocol, targetSchemaVersion) => {
  // Get migration steps between versions
  const migrationPath = getMigrationPath(protocol, targetSchemaVersion);

  // Perform migration
  const updatedProtocol = migrationPath.reduce(migrateStep, protocol);

  return {
    ...updatedProtocol,
    schemaVersion: targetSchemaVersion,
  };
};

module.exports = migrateProtocol;
