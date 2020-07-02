/* eslint-env jest */

const version4 = require('../4');

const v4protocol = {
  codebook: {
    node: {
      disallowedType: {
        name: 'disallowed type name',
        variables: {
          invalidExampleVariable: {
            name: 'variable (with) disallowed characters!',
            options: [
              { label: 'foo', value: 'f o o!' },
              { label: 'foo2', value: 'f o o?' }, // should resolve to the same as previous, therefore needs incrementing
              { label: 'bar', value: 'b_a-r:.' },
              { label: 'bazz', value: 5 },
            ],
          },
          invalidExampleVariableDuplicate: {
            // should resolve to the same as previous, therefore needs incrementing
            name: 'variable (with) disallowed characters?',
          },
          validExampleVariable: {
            name: 'variable_with-allowed:characters.',
          },
        },
      },
      disallowedTypeDuplicate: {
        // should resolve to the same as previous, therefore needs incrementing
        name: 'disallowed_type name',
      },
      allowedTypeName: {
        name: 'okay_-type:.name',
      },
    },
    edge: {
      edgeType: {
        name: 'bar bazz',
        variables: {
          buzz: { name: 'fizz pop' },
        },
      },
    },
    ego: {
      variables: {
        foo: { name: 'foo bar' },
      },
    },
  },
};

describe('migrate v3 -> v4', () => {
  it('migrates codebook', () => {
    const result = version4.migration(v4protocol);

    expect(result).toMatchSnapshot();
  });

  it('type names', () => {
    const result = version4.migration(v4protocol);

    const nodeDefinitions = result.codebook.node;

    expect(nodeDefinitions.disallowedType.name).toBe('disallowed_type_name');
    expect(nodeDefinitions.disallowedTypeDuplicate.name).toBe('disallowed_type_name2');
    expect(nodeDefinitions.allowedTypeName.name).toBe('okay_-type:.name');
    expect(nodeDefinitions).toMatchSnapshot();
  });

  it('variable names', () => {
    const result = version4.migration(v4protocol);

    const variables = result.codebook.node.disallowedType.variables;
    expect(variables.invalidExampleVariable.name).toBe('variable_with_disallowed_characters');
    expect(variables.invalidExampleVariableDuplicate.name).toBe('variable_with_disallowed_characters2');
    expect(variables.validExampleVariable.name).toBe('variable_with-allowed:characters.');
    expect(variables).toMatchSnapshot();
  });

  it('option values', () => {
    const result = version4.migration(v4protocol);

    const options = result.codebook.node.disallowedType.variables.invalidExampleVariable.options;
    expect(options).toEqual(expect.arrayContaining([
      expect.objectContaining({ value: 'f_o_o' }),
      expect.objectContaining({ value: 'f_o_o2' }),
      expect.objectContaining({ value: 'b_a-r:.' }),
      expect.objectContaining({ value: 5 }),
    ]));
    expect(options).toMatchSnapshot();
  });
});
