const migrations = require('./migrations');
const errors = require('./errors');

const matchVersion = targetVersion =>
  ({ version }) =>
    version === targetVersion;

const migrateStep = (protocol, { migration }) => {
  if (!migration) { throw errors.MigrationNotPossibleError; }

  return migration(protocol);
};

const migrateProtocol = (protocol, targetSchemaVersion) => {
  const protocolSchemaVersion = protocol.schemaVersion;

  const protocolMigrationIndex = migrations.findIndex(matchVersion(protocolSchemaVersion));
  const targetMigrationIndex = migrations.findIndex(matchVersion(targetSchemaVersion));

  if (protocolMigrationIndex === -1) {
    throw errors.CurrentProtocolNotFoundError;
  }

  if (targetMigrationIndex === -1) {
    throw errors.TargetProtocolNotFoundError;
  }

  // Get migration steps between versions
  const migrationPath = migrations.slice(protocolMigrationIndex + 1, targetMigrationIndex + 1);

  // Perform migration
  const updatedProtocol = migrationPath.reduce(migrateStep, protocol);

  return {
    ...updatedProtocol,
    schemaVersion: targetSchemaVersion,
  };
};

module.exports = migrateProtocol;
