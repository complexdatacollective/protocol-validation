/* eslint-env node */
/* eslint-disable no-console */

/**
 * Usage:
 * npm run validate-protocol [protocol-path]
 *
 * Errors & Validation failures are written to stderr.
 */
import chalk from 'chalk';
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';



const { validateSchema, validateLogic } = require("../validation");
const { errToString } = require("../validation/helpers");

const protocolArg = process.argv[2];
const forceSchemaArg = process.argv[3];

if (!protocolArg) {
  console.error("You must specify a protocol file to validate.");
  process.exit(1);
}

const protocolFilepath = protocolArg;
const protocolName = basename(protocolFilepath);
const exitOnValidationFailure = !!process.env.CI;

let data;

const validateJson = (jsonString) => {
  try {
    data = JSON.parse(jsonString);
  } catch (e) {
    console.error(chalk.red("Invalid protocol file"));
    console.error(e);
    process.exit(1);
  }

  const schemaErrors = validateSchema(data, forceSchemaArg);
  const dataErrors = validateLogic(data);
  const isValid = !schemaErrors.length && !dataErrors.length;

  if (isValid) {
    console.log(chalk.green(`${protocolName} is valid.`));
  } else {
    console.log(chalk.red(`${protocolName} is NOT valid!`));
    if (schemaErrors.length) {
      console.error(`${protocolName} has the following schema errors:`);
      schemaErrors.forEach((err) => console.warn("-", errToString(err)));
    }

    if (dataErrors.length) {
      console.error(`${protocolName} has the following data errors:`);
      dataErrors.forEach((err) => console.warn("-", errToString(err)));
    }

    if (exitOnValidationFailure) {
      process.exit(1);
    }
  }
};

try {
  validateJson(readFileSync(protocolFilepath));
} catch (err) {
  console.error(err);
  process.exit(1);
}
