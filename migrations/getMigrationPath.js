const migrations = require('./migrations');
const errors = require('./errors');

const matchVersion = targetVersion =>
  ({ version }) =>
    version === targetVersion;

const isMigrationPathValid = path =>
  !path.some(({ migration }) => !migration);

const getMigrationPath = (protocol, targetSchemaVersion) => {
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

  if (!isMigrationPathValid(migrationPath)) {
    throw errors.MigrationNotPossibleError;
  }

  return migrationPath;
};

module.exports = getMigrationPath;
