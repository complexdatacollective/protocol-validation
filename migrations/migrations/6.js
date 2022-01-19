/**
 * Migration from v5 to v6
 */

const migrateStages = (stages = []) => stages.map(stage => {

  if (stage.type !== 'NameGeneratorAutocomplete' && stage.type !== 'NameGeneratorList') {
    return stage;
  }

  return {
    ...stage,
    type: 'NameGeneratorRoster',
  }
});

const migration = (protocol) => {
  return {
    ...protocol,
    stages: migrateStages(protocol.stages),
  }
}

// Markdown format
const notes = `
- Replace roster-based name generators (small and large) with a single new interface that combines the functionality of both.
- Enable support for using the automatic node positioning feature on the Sociogram interface.
`;

const v6 = {
  version: 6,
  notes,
  migration,
};

module.exports = v6;
