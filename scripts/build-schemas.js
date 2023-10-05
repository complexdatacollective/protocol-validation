import { readJson } from "fs-extra/esm";
import { readdir, writeFile } from "node:fs/promises";
import { join, extname, basename, resolve } from "node:path";
import Ajv from "ajv";
import standaloneCode from "ajv/dist/standalone/index.js";

const SCHEMA_SRC_PATH = "schemaSource";
const SCHEMA_OUTPUT_PATH = "schemas";

const ajv = new Ajv({ code: { source: true, esm: true, lines: true }, allErrors: true, allowUnionTypes: true });
ajv.addFormat("integer", /\d+/);
ajv.addFormat('date-time', /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);

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
const getSchemas = async (directory) => {
  const files = await readdir(directory);
  return files.filter(isJsonFile).map(getBaseName);
}

const generateModuleIndex = (schemas) => {
  const formatRequire = (baseSchemaName) => {
    const relativeModulePath = join(`./${baseSchemaName}.js`);
    return `import ${asVariableName(
      baseSchemaName,
    )} from './${relativeModulePath}';`;
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

export default versions;
\r\n`;
};

const buildSchemas = async () => {
  const schemaSrcDirectory = resolve(SCHEMA_SRC_PATH);
  const schemaOutputDirectory = resolve(SCHEMA_OUTPUT_PATH);
  const schemas = await getSchemas(schemaSrcDirectory);

  schemas.forEach(async (baseSchemaName) => {
    const schemaPath = join(schemaSrcDirectory, `${baseSchemaName}.json`);
    const modulePath = join(schemaOutputDirectory, `${baseSchemaName}.js`);

    const schema = await readJson(schemaPath);
    const validate = ajv.compile(schema);
    const moduleCode = standaloneCode(ajv, validate);

    await writeFile(modulePath, moduleCode);

    console.log(`${baseSchemaName} done.`); // eslint-disable-line
  });

  const moduleIndexPath = join(schemaOutputDirectory, "index.js");
  const moduleIndex = generateModuleIndex(schemas);
  await writeFile(moduleIndexPath, moduleIndex);
};

buildSchemas();
