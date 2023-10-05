import { readdir, readJson, writeFile, resolve } from "node:fs";
import { join, extname, basename } from "node:path";
import Ajv from "ajv";
import pack from "ajv-pack";

const ajv = new Ajv({ sourceCode: true, allErrors: true });
ajv.addFormat("integer", /\d+/);

const isJsonFile = (fileName) => extname(fileName) === ".json";

const getBaseName = (schemaFileName) => basename(schemaFileName, ".json");

const asVariableName = (schemaName) =>
  `version_${schemaName.replace(/\./g, "_")}`;

const asIntName = (schemaName) => {
  if (isNaN(parseInt(schemaName, 10))) {
    throw Error("Schema version could not be converted to integer");
  }

  return parseInt(schemaName, 10);
};

// get schemas,
const getSchemas = (directory) => readdir(directory)
  .then((files) => files.filter(isJsonFile).map(getBaseName));

const generateModuleIndex = (schemas) => {
  const formatRequire = (baseSchemaName) => {
    const relativeModulePath = join(`./${baseSchemaName}.js`);
    return `const ${asVariableName(
      baseSchemaName,
    )} = require('./${relativeModulePath}');`;
  };

  const formatVersions = (baseSchemaName) =>
    `  { version: ${asIntName(baseSchemaName)}, validator: ${asVariableName(
      baseSchemaName,
    )} },`;

  const schemaRequires = schemas.map(formatRequire).join("\n");
  const schemaVersions = `${schemas.map(formatVersions).join("\n")}`;

  return `${schemaRequires}

const versions = [
${schemaVersions}
];

module.exports = versions;
\r\n`;
};

const buildSchemas = async () => {
  const schemasDirectory = resolve("schemas");

  const schemas = await getSchemas(schemasDirectory);

  schemas.forEach(async (baseSchemaName) => {
    const schemaPath = join(schemasDirectory, `${baseSchemaName}.json`);
    const modulePath = join(schemasDirectory, `${baseSchemaName}.js`);

    const schema = await readJson(schemaPath);
    const validate = ajv.compile(schema);
    const moduleCode = pack(ajv, validate);

    await writeFile(modulePath, moduleCode);

    console.log(`${baseSchemaName} done.`); // eslint-disable-line
  });

  const moduleIndexPath = join(schemasDirectory, "index.js");
  const moduleIndex = generateModuleIndex(schemas);
  await writeFile(moduleIndexPath, moduleIndex);
};

buildSchemas();
