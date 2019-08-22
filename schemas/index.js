const version_1_0_0 = require('./1.0.0.js');
const version_1 = require('./1.js');
const version_2 = require('./2.js');

const versions = [
  { version: '1.0.0', schema: version_1_0_0 },
  { version: '1', schema: version_1 },
  { version: '2', schema: version_2 },
];

module.exports = versions;

