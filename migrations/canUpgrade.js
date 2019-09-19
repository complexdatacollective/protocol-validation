const getMigrationPath = require('./getMigrationPath');

const canUpgrade = (protocol, targetSchemaVersion) => {
  try {
    getMigrationPath(protocol, targetSchemaVersion);
  } catch (e) {
    return false;
  }

  return true;
};

module.exports = canUpgrade;
