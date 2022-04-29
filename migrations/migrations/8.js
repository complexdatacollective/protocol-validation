/**
 * Migration from v7 to v8
 */

const migration = (protocol) => protocol;

// Markdown format
const notes = `
- Add new validation options for form fields: \`greaterThanVariable\` and \`lessThanVariable\`.
`;

const v8 = {
  version: 8,
  notes,
  migration,
};

module.exports = v8;
