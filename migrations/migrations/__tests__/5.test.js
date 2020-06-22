/* eslint-env jest */

const migrate = require('../5');

const v4protocol = {
  codebook: {
    node: {
      exampleNodeType: {
        variables: {
          invalidExampleVariable: {
            name: 'variable (with) disallowed characters!',
            options: [
              { label: 'foo', value: 'f o o!' },
              { label: 'bar', value: 'b_a-r:.' },
              { label: 'bazz', value: 5 },
            ],
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

  it('option values', () => {
    const result = migrate(v4protocol);

    const options = result.codebook.node.exampleNodeType.variables.invalidExampleVariable.options;
    expect(options).toEqual(expect.arrayContaining([
      expect.objectContaining({ value: 'f_o_o_' }),
      expect.objectContaining({ value: 'b_a-r:.' }),
      expect.objectContaining({ value: 5 }),
    ]));
  });
});
