const CurrentProtocolNotFoundError = new Error('Current protocol version not found');
const TargetProtocolNotFoundError = new Error('Target protocol version not found');
const MigrationNotPossibleError = new Error('Migration to this version is not possible');

module.exports = {
  CurrentProtocolNotFoundError,
  TargetProtocolNotFoundError,
  MigrationNotPossibleError,
};
