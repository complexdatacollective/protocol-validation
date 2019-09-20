const version_1 = require('./1.js');
const version_2 = require('./2.js');

const versions = [
  { version: 1, validator: version_1 },
  { version: 2, validator: version_2 },
];

module.exports = versions;

