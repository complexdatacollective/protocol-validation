const version4 = require('./4');

/**
 * These should be in order
 */
const migrations = [
  { version: '1.0.0', migration: protocol => protocol },
  { version: 1, migration: protocol => protocol },
  { version: 2, migration: protocol => protocol },
  { version: 3, migration: protocol => protocol },
  version4,
];

module.exports = migrations;
