/**
 * Migration from v4 to v5
 */

const setProps = (props, source = {}) =>
  Object.keys(props)
    .reduce((acc, key) => {
      if (!source[key]) { return acc; }
      return { ...acc, [key]: props[key] };
    }, source);

const getSafeValue = value => (
  typeof value === 'string' ?
    value.replace(/[\s]+/g, '_').replace(/[^a-zA-Z0-9._:-]+/g, '') :
    value
);

const migrateOptionValues = (options = []) =>
  options.map(
    ({ value, ...rest }) =>
      ({ ...rest, value: getSafeValue(value) }),
  );

const migrateVariable = (variable = {}) => setProps({
  options: migrateOptionValues(variable.options),
  name: getSafeValue(variable.name),
}, variable);

const migrateVariables = (variables = {}) =>
  Object.keys(variables)
    .reduce((acc, variableId) => ({
      ...acc,
      [variableId]: migrateVariable(variables[variableId]),
    }), {});

const migrateType = (type = {}) => setProps({
  variables: migrateVariables(type.variables),
}, type);

const migrateTypes = (types = {}) =>
  Object.keys(types)
    .reduce((acc, typeId) => ({
      ...acc,
      [typeId]: migrateType(types[typeId]),
    }), {});

const migration = (protocol) => {
  const codebook = protocol.codebook;

  const newCodebook = setProps({
    node: migrateTypes(codebook.node),
    edge: migrateTypes(codebook.edge),
    ego: migrateType(codebook.ego),
  }, codebook);

  return {
    ...protocol,
    codebook: newCodebook,
  };
};

// Markdown format
const information = `This update will **rename variables and option values** to match the requirements of graphml exports:

- Only letters, numbers and the symbols ._-: are allowed
- Spaces will be replaced with _
- Any other symbols will be removed
`;

const v5 = {
  version: 5,
  information,
  migration,
};

module.exports = v5;
