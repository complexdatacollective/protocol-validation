const version5 = require('./5');

const migrations = [
  { version: 1, migration: protocol => protocol },
  { version: 2, migration: protocol => protocol },
  { version: 3, migration: protocol => protocol },
  { version: 4, migration: protocol => protocol },
  version5,
];

module.exports = migrations;
