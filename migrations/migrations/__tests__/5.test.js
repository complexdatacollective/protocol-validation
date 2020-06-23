/* eslint-env jest */

const version5 = require('../5');

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
    const result = version5.migration(v4protocol);

    const variables = result.codebook.node.exampleNodeType.variables;
    expect(variables.invalidExampleVariable.name).toBe('variable_with_disallowed_characters');
    expect(variables.validExampleVariable.name).toBe('variable_with-allowed:characters.');
    expect(result).toMatchSnapshot();
  });

  it('option values', () => {
    const result = version5.migration(v4protocol);

    const options = result.codebook.node.exampleNodeType.variables.invalidExampleVariable.options;
    expect(options).toEqual(expect.arrayContaining([
      expect.objectContaining({ value: 'f_o_o' }),
      expect.objectContaining({ value: 'b_a-r:.' }),
      expect.objectContaining({ value: 5 }),
    ]));
    expect(result).toMatchSnapshot();
  });
});
