const migrations = [
  { version: 1, migration: protocol => protocol },
  { version: 2, migration: protocol => protocol },
  { version: 3, migration: protocol => protocol },
  { version: 4, migration: protocol => protocol },
  { version: 5, migration: protocol => protocol }, // from 4 to 5
];

module.exports = migrations;
