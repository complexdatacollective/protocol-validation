const Validator = require('./Validator');
const {
  duplicateId,
  duplicateInArray,
  entityDefFromRule,
  getVariablesForSubject,
  getVariableNames,
  getEntityNames,
  nodeVarsIncludeDisplayVar,
} = require('./helpers');


/**
 * Define and run all dynamic validations (which aren't covered by the JSON Schema).
 *
 * @return {string[]} an array of failure messages from the validator
 */
const validateLogic = (protocol) => {
  const v = new Validator(protocol);
  const codebook = protocol.codebook;

  const get = (obj, path, def) => {
    /**
     * If the path is a string, convert it to an array
     * @param  {String|Array} path The path
     * @return {Array}             The path array
     */
    const stringToPath = (inputPath) => {
      // If the inputPath isn't a string, return it
      if (typeof inputPath !== 'string') return inputPath;

      // Create new array
      const output = [];

      // Split to an array with dot notation
      inputPath.split('.').forEach((item) => {
        // Split to an array with bracket notation
        item.split(/\[([^}]+)\]/g).forEach((key) => {
          // Push to the new array
          if (key.length > 0) {
            output.push(key);
          }
        });
      });

      return output;
    };

    // Get the path as an array
    const pathArray = stringToPath(path);

    // Cache the current object
    let current = obj;

    // For each item in the path, dig into the object
    for (let i = 0; i < pathArray.length; i += 1) {
      // If the item isn't found, return the default (or null)
      if (!current[pathArray[i]]) return def;

      // Otherwise, update the current  value
      current = current[pathArray[i]];
    }

    return current;
  };

  v.addValidation('codebook',
    codebook => !duplicateInArray(getEntityNames(codebook)),
    codebook => `Duplicate entity name "${duplicateInArray(getEntityNames(codebook))}"`,
  );

  v.addValidation('codebook.node.*',
    nodeType => nodeVarsIncludeDisplayVar(nodeType),
    nodeType => `node displayVariable "${nodeType.displayVariable}" did not match any node variable`);

  v.addValidationSequence('stages[].subject',
    [
      subject => codebook[subject.entity],
      subject => `"${subject.entity}" is not defined in the codebook`,
    ],
    [
      subject => Object.keys(codebook[subject.entity]).includes(subject.type),
      subject => `"${subject.type}" definition not found in codebook["${subject.entity}"]`,
    ],
  );

  // Tries to validate inline forms.
  // If the stage type is egoform, lookup variables in codebook[ego]
  // Otherwise, use stage.subject to get codebook reference
  v.addValidationSequence('stages[].form.fields[]',
    [
      (field, subject, keypath) => {
        // We know that keypath will be in key order, with dedicated keys for array index.
        // Therefore: keypath[1] = 'stages', keypath[2] = [index]
        const stage = get(protocol, `${keypath[1]}${keypath[2]}`);
        let codebookEntity;

        if (stage.type === 'EgoForm') {
          codebookEntity = codebook.ego;
        } else {
          const stageSubject = stage.subject;
          const path = `codebook.${stageSubject.entity}.${stageSubject.type}`;

          codebookEntity = get(protocol, path);
        }

        const variable = field.variable;

        return codebookEntity.variables[variable];
      },
      () => 'Form field variable not found in codebook.',
    ],
  );

  v.addValidationSequence('filter.rules[]',
    [
      rule => entityDefFromRule(rule, codebook),
      rule => `Rule option type "${rule.options.type}" is not defined in codebook`,
    ],
    [
      (rule) => {
        if (!rule.options.attribute) { return true; } // Entity type rules do not have an attribute
        const variables = entityDefFromRule(rule, codebook).variables;
        return variables && variables[rule.options.attribute];
      },
      rule => `"${rule.options.attribute}" is not a valid variable ID`,
    ],
  );

  v.addValidation('protocol.stages',
    stages => !duplicateId(stages),
    stages => `Stages contain duplicate ID "${duplicateId(stages)}"`,
  );

  v.addValidation('stages[].panels',
    panels => !duplicateId(panels),
    panels => `Panels contain duplicate ID "${duplicateId(panels)}"`,
  );

  v.addValidation('.rules',
    rules => !duplicateId(rules),
    rules => `Rules contain duplicate ID "${duplicateId(rules)}"`,
  );

  v.addValidation('stages[].prompts',
    prompts => !duplicateId(prompts),
    prompts => `Prompts contain duplicate ID "${duplicateId(prompts)}"`,
  );

  v.addValidation('stages[].items',
    items => !duplicateId(items),
    items => `Items contain duplicate ID "${duplicateId(items)}"`,
  );

  v.addValidation('codebook.*.*.variables',
    variableMap => !duplicateInArray(getVariableNames(variableMap)),
    variableMap => `Duplicate variable name "${duplicateInArray(getVariableNames(variableMap))}"`,
  );

  v.addValidation('prompts[].variable',
    (variable, subject) => getVariablesForSubject(codebook, subject)[variable],
    (variable, subject) => `"${variable}" not defined in codebook[${subject.entity}][${subject.type}].variables`,
  );

  v.addValidation('prompts[].otherVariable',
    (otherVariable, subject) => getVariablesForSubject(codebook, subject)[otherVariable],
    (otherVariable, subject) => `"${otherVariable}" not defined in codebook[${subject.entity}][${subject.type}].variables`,
  );

  v.addValidation('prompts[].layout.layoutVariable',
    (variable, subject) => getVariablesForSubject(codebook, subject)[variable],
    (variable, subject) => `Layout variable "${variable}" not defined in codebook[${subject.entity}][${subject.type}].variables`,
  );

  v.addValidation('prompts[].additionalAttributes',
    (additionalAttributes, subject) => additionalAttributes.every(
      ({ variable }) => getVariablesForSubject(codebook, subject)[variable],
    ),
    additionalAttributes => `One or more sortable properties not defined in codebook: ${additionalAttributes.map(({ variable }) => variable)}`,
  );

  v.runValidations();

  v.warnings.forEach(warning => console.error(warning)); // eslint-disable-line no-console

  return v.errors;
};

module.exports = validateLogic;
