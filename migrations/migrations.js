const v5migrator = require('./migrators/5');

const migrations = [
  { version: 1, migration: protocol => protocol },
  { version: 2, migration: protocol => protocol },
  { version: 3, migration: protocol => protocol },
  { version: 4, migration: protocol => protocol },
  { version: 5, migration: v5migrator },
];

module.exports = migrations;
