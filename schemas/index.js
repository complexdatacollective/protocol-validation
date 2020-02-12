const version_1 = require('./1.js');
const version_2 = require('./2.js');
const version_3 = require('./3.js');
const version_4 = require('./4.js');

const versions = [
  { version: 1, validator: version_1 },
  { version: 2, validator: version_2 },
  { version: 3, validator: version_3 },
  { version: 4, validator: version_4 },
];

module.exports = versions;

