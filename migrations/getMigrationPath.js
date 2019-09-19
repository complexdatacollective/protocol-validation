const migrations = require('./migrations');
const getMigrationIndex = require('./getMigrationIndex');
const errors = require('./errors');

const isMigrationPathValid = path =>
  !path.some(({ migration }) => !migration);

const getMigrationPath = (sourceSchemaVersion, targetSchemaVersion) => {
  const sourceMigrationIndex = getMigrationIndex(sourceSchemaVersion);
  const targetMigrationIndex = getMigrationIndex(targetSchemaVersion);

  if (sourceMigrationIndex === null) { throw new errors.VersionNotFoundError(sourceSchemaVersion); }
  if (targetMigrationIndex === null) { throw new errors.VersionNotFoundError(targetSchemaVersion); }

  if (sourceMigrationIndex >= targetMigrationIndex) {
    throw new errors.MigrationNotPossibleError(sourceSchemaVersion, targetSchemaVersion);
  }

  // Get migration steps between versions
  const migrationPath = migrations.slice(sourceMigrationIndex + 1, targetMigrationIndex + 1);

  if (!isMigrationPathValid(migrationPath)) {
    throw new errors.MigrationNotPossibleError(sourceSchemaVersion, targetSchemaVersion);
  }

  return migrationPath;
};

module.exports = getMigrationPath;
