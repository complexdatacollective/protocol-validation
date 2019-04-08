/* eslint-env node */
/* eslint-disable no-console */

/**
 * Usage:
 * npm run validate-protocol [protocol-path]
 *
 * Errors & Validation failures are written to stderr.
 */
const Chalk = require('chalk').constructor;
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

const { validateSchema, validateLogic } = require('../validation');
const { errToString } = require('../validation/helpers');

const projectDir = path.join(__dirname, '..');
const schemaDir = path.join(projectDir, 'schemas');
const protocolArg = process.argv[2];

if (!protocolArg) {
  console.error('You must specify a protocol file to validate.');
  process.exit(1);
}

const protocolFilepath = protocolArg;
const protocolName = path.basename(protocolFilepath);
const exitOnValidationFailure = !!process.env.CI;

let protocolContents;

let schema;
let data;

const chalk = new Chalk({ enabled: !!process.stderr.isTTY });

const extractProtocolSource = async (zippedProtocol) => {
  const zip = new JSZip();
  const zipObject = await zip.loadAsync(zippedProtocol);
  const contents = await zipObject.file('protocol.json').async('string');
  return contents;
};

const schemaVersion = 1;

const validateJson = (jsonString) => {
  try {
    schema = JSON.parse(fs.readFileSync(path.join(schemaDir, `v${schemaVersion}.json`)));
  } catch (e) {
    console.error(chalk.red('Invalid schema'));
    console.error();
    console.error(e);
    process.exit(1);
  }

  try {
    data = JSON.parse(jsonString);
  } catch (e) {
    console.error(chalk.red('Invalid protocol file'));
    console.error(e);
    process.exit(1);
  }

  const schemaErrors = validateSchema(data, schema);
  const dataErrors = validateLogic(data);
  const isValid = !schemaErrors.length && !dataErrors.length;

  if (isValid) {
    console.log(`${protocolName} is valid`);
  } else {
    if (schemaErrors.length) {
      console.error(chalk.red(`${protocolName} has schema errors:`));
      schemaErrors.forEach(err => console.warn('-', errToString(err)));
    }

    if (dataErrors.length) {
      console.error(chalk.red(`${protocolName} has data errors:`));
      dataErrors.forEach(err => console.warn('-', errToString(err)));
    }

    if (exitOnValidationFailure) {
      process.exit(1);
    }
  }
};

try {
  protocolContents = fs.readFileSync(protocolFilepath);
} catch (err) {
  console.error(err);
  process.exit(1);
}

if (protocolFilepath.match(/\.netcanvas$/)) {
  extractProtocolSource(protocolContents)
    .then(jsonString => validateJson(jsonString));
} else {
  validateJson(fs.readFileSync(protocolFilepath));
}
