const migrations = require('./migrations');
const MigrationNotPossibleError = require('./errors').MigrationNotPossibleError;
const VersionMismatchError = require('./errors').VersionMismatchError;

const isMigrationPathValid = path =>
  !path.some(({ migration }) => !migration);

const matchMigrations = (sourceVersion, targetVersion) =>
  ({ version }) =>
    version > sourceVersion && version <= targetVersion;

const getMigrationPath = (rawSourceSchemaVersion, targetSchemaVersion) => {
  if (!Number.isInteger(targetSchemaVersion)) {
    throw new Error(`Target schemaVersion ${JSON.stringify(targetSchemaVersion)} must be an integer.`);
  }

  // This is a shim for the original schema which used the format "1.0.0"
  const sourceSchemaVersion = rawSourceSchemaVersion === '1.0.0' ? 1 : rawSourceSchemaVersion;

  // In case string version numbers are accidentally reintroduced.
  if (!Number.isInteger(sourceSchemaVersion)) {
    throw new Error(`Source protocol schemaVersion ${JSON.stringify(sourceSchemaVersion)} not recognised. Is a string.`);
  }

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
