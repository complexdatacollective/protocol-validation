/* eslint-env jest */

const migrate = require('../5');

const v4protocol = {
  codebook: {
    node: {
      exampleNodeType: {
        variables: {
          invalidExampleVariable: {
            name: 'variable (with) disallowed characters!',
          },
          validExampleVariable: {
            name: 'variable_with-allowed:characters.',
          },
        },
      },
    },
  },
};

describe('migrate v4 -> v5', () => {
  it('variable names', () => {
    const result = migrate(v4protocol);

    const variables = result.codebook.node.exampleNodeType.variables;
    expect(variables.invalidExampleVariable.name).toBe('variable__with__disallowed_characters_');
    expect(variables.validExampleVariable.name).toBe('variable_with-allowed:characters.');
  });

  it.todo('option values');
});
