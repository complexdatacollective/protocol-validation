const migrations = require('./migrations');
const MigrationNotPossibleError = require('./errors').MigrationNotPossibleError;
const VersionMismatchError = require('./errors').VersionMismatchError;

const isMigrationPathValid = path =>
  !path.some(({ migration }) => !migration);

const matchMigrations = (sourceVersion, targetVersion) =>
  ({ version }) =>
    version > sourceVersion && version <= targetVersion;

const getMigrationPath = (sourceSchemaVersion, targetSchemaVersion) => {
  if (sourceSchemaVersion >= targetSchemaVersion) {
    throw new VersionMismatchError(sourceSchemaVersion, targetSchemaVersion);
  }

  // Get migration steps between versions
  const migrationPath = migrations.filter(
    matchMigrations(sourceSchemaVersion, targetSchemaVersion),
  );

  if (!isMigrationPathValid(migrationPath)) {
    throw new MigrationNotPossibleError(sourceSchemaVersion, targetSchemaVersion);
  }

  return migrationPath;
};

module.exports = getMigrationPath;
