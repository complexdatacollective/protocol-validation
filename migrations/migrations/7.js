/**
 * Migration from v6 to v7
 */

const migration = (protocol) => protocol;

// Markdown format
const notes = `
- Add additional skip logic options.
`;

const v7 = {
  version: 7,
  notes,
  migration,
};

module.exports = v7;
