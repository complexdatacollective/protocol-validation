/**
 * Migration from v3 to v4
 */

const setProps = (props, source = {}) =>
  Object.keys(props)
    .reduce((acc, key) => {
      if (!source[key]) { return acc; }
      return { ...acc, [key]: props[key] };
    }, source);

const getNextSafeValue = (value, existing, inc = 1) => {
  const incrementedValue = inc > 1 ? `${value}${inc}` : value;
  if (!existing.includes(incrementedValue)) { return incrementedValue; }

  return getNextSafeValue(value, existing, inc + 1);
};

const getSafeValue = (value, existing = []) => {
  if (typeof value !== 'string') { return value; } // some option values are numeric

  const safeValue = value.replace(/[\s]+/g, '_').replace(/[^a-zA-Z0-9._:-]+/g, '');

  return getNextSafeValue(safeValue, existing);
};

const getNames = (obj = {}) =>
  Object.keys(obj)
    .map(key => obj[key].name);

const migrateOptionValues = (options = []) =>
  options.reduce((acc, { value, ...rest }) => ([
    ...acc,
    { ...rest, value: getSafeValue(value, acc.map(o => o.value)) },
  ]), []);

const migrateVariable = (variable = {}, acc = {}) => setProps({
  options: migrateOptionValues(variable.options),
  name: getSafeValue(variable.name, getNames(acc)),
}, variable);

const migrateVariables = (variables = {}) =>
  Object.keys(variables)
    .reduce((acc, variableId) => ({
      ...acc,
      [variableId]: migrateVariable(variables[variableId], acc),
    }), {});

const migrateType = (type = {}, acc = {}) => setProps({
  name: getSafeValue(type.name, getNames(acc)),
  variables: migrateVariables(type.variables),
}, type);

const migrateTypes = (types = {}) =>
  Object.keys(types)
    .reduce((acc, typeId) => ({
      ...acc,
      [typeId]: migrateType(types[typeId], acc),
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
const notes = `This update will automatically **rename** _variables_ and _option values_ to match the requirements of graphml exports:

- Only letters, numbers and the symbols ._-: are allowed
- Spaces will be replaced with _
- Any other symbols will be removed
- Any variables or options that clash as a result of these changes will get a numerical suffix
- Entity names must be unique, duplicates will get a numerical suffix.`;

const v4 = {
  version: 4,
  notes,
  migration,
};

module.exports = v4;
