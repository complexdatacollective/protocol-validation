const getMigrationPath = require('./getMigrationPath');

const hasMigrationPath = (protocol, targetSchemaVersion) => {
  try {
    getMigrationPath(protocol, targetSchemaVersion);
  } catch(e) {
    return false;
  }

  return true;
};

module.exports = hasMigrationPath;
