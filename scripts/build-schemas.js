const fs = require('fs-extra');
const path = require('path');
const Ajv = require('ajv');
const pack = require('ajv-pack');

const ajv = new Ajv({ sourceCode: true, allErrors: true });
ajv.addFormat('integer', /\d+/);

const isJsonFile = fileName =>
  path.extname(fileName) === '.json';

const getSchemaName = schemaFileName =>
  path.basename(schemaFileName, '.json');

const asVariableName = schemaName =>
  `version_${schemaName.replace(/\./g, '_')}`;

// get schemas,
const getSchemas = directory =>
  fs.readdir(directory)
    .then(
      files =>
        files
          .filter(isJsonFile)
          .map(getSchemaName),
    );

const generateModuleIndex = (schemas) => {
  const formatRequire = (schemaName) => {
    const relativeModulePath = path.join(`./${schemaName}.js`);
    return `const ${asVariableName(schemaName)} = require('./${relativeModulePath}');`;
  };

  const formatVersions = schemaName =>
    `  { version: '${schemaName}', schema: ${asVariableName(schemaName)} },`;

  const schemaRequires = schemas.map(formatRequire).join('\n');
  const schemaVersions = `${schemas.map(formatVersions).join('\n')}`;

  return `${schemaRequires}

const versions = [
${schemaVersions}
];

module.exports = versions;
\r\n`;
};

const buildSchemas = async () => {
  const schemasDirectory = path.resolve('schemas');

  const schemas = await getSchemas(schemasDirectory);

  schemas.forEach(async (schemaName) => {
    const schemaPath = path.join(schemasDirectory, `${schemaName}.json`);
    const modulePath = path.join(schemasDirectory, `${schemaName}.js`);

    const schema = await fs.readJson(schemaPath);
    const validate = ajv.compile(schema);
    const moduleCode = pack(ajv, validate);

    await fs.writeFile(modulePath, moduleCode);

    console.log(`${schemaName} done.`); // eslint-disable-line
  });

  const moduleIndexPath = path.join(schemasDirectory, 'index.js');
  const moduleIndex = generateModuleIndex(schemas);
  await fs.writeFile(moduleIndexPath, moduleIndex);
};

buildSchemas();
