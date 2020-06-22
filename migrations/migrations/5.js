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
    value.replace(/[^a-zA-Z0-9._:-]/g, '_') :
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

const migrate = (protocol) => {
  const codebook = protocol.codebook;

  const newCodebook = setProps({
    node: migrateTypes(codebook.node),
    edge: migrateTypes(codebook.edge),
    ego: migrateType(codebook.ego),
  }, codebook);

  console.log(JSON.stringify(codebook));

  return {
    ...protocol,
    codebook: newCodebook,
  };
};

module.exports = migrate;
