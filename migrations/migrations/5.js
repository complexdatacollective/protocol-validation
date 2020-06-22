/**
 * Migration from v4 to v5
 */

const migrateVariables = (variables = {}) =>
  Object.keys(variables)
    .reduce((acc, variableId) => {
      const variable = variables[variableId];
      const name = variable.name.replace(/[^a-zA-Z0-9._:-]/g, '_');

      return {
        ...acc,
        [variableId]: {
          ...variable,
          name,
        },
      };
    }, {});

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

const migrate = (protocol) => {
  const codebook = {
    node: protocol.codebook.node && migrateTypes(protocol.codebook.node),
    edge: protocol.codebook.edge && migrateTypes(protocol.codebook.edge),
    ego: protocol.codebook.ego && migrateType(protocol.codebook.ego),
  };

  return {
    ...protocol,
    codebook,
  };
};

module.exports = migrate;
