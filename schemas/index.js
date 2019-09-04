const version_1_0_0 = require('./1.0.0.js');
const version_1 = require('./1.js');

const versions = [
  { version: '1.0.0', schema: version_1_0_0 },
  { version: '1', schema: version_1 },
];

module.exports = versions;

