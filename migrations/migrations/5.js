/**
 * Migration from v4 to v5
 */

const propify = (props, source) =>
  Object.keys(props)
    .reduce((acc, key) => {
      if (!source[key]) { return acc; }
      return { ...acc, [key]: props[key] };
    }, source);

const getSafeValue = value => (
  typeof value === 'string' ?
    value.replace(/[^a-zA-Z0-9._:-]/g, '_') :
    value
);

const migrateOptionValues = options =>
  options.map(
    ({ value, ...rest }) =>
      ({ ...rest, value: getSafeValue(value) }),
  );

const migrateVariable = ({ name, options, ...rest }) => ({
  ...rest,
  ...(options ? { options: migrateOptionValues(options) } : {}),
  name: getSafeValue(name),
});

const migrateVariables = (variables = {}) =>
  Object.keys(variables)
    .reduce((acc, variableId) => ({
      ...acc,
      [variableId]: migrateVariable(variables[variableId]),
    }), {});

const migrateType = (type = {}) => ({
  ...type,
  variables: type.variables && migrateVariables(type.variables),
});

const migrateTypes = (types = {}) =>
  Object.keys(types)
    .reduce((acc, typeId) => ({
      ...acc,
      [typeId]: migrateType(types[typeId]),
    }), {});


// props({
//   foo: doThing,
// }, source);

const migrate = (protocol) => {
  const codebook = protocol.codebook;

  const newCodebook = {
    ...(codebook.node ? { node: migrateTypes(codebook.node) } : {}),
    ...(codebook.edge ? { edge: migrateTypes(codebook.edge) } : {}),
    ...(codebook.ego ? { ego: migrateType(codebook.ego) } : {}),
  };

  return {
    ...protocol,
    codebook: newCodebook,
  };
};

module.exports = migrate;
