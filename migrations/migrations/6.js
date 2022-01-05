/**
 * Migration from v5 to v6
 */

const migration = (protocol) => protocol;

// Markdown format
const notes = `
- Enable support for using the automatic node positioning feature on the Sociogram interface.
`;

const v6 = {
  version: 6,
  notes,
  migration,
};

module.exports = v6;
