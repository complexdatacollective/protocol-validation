class MigrationNotPossibleError extends Error {
  constructor(from = undefined, to = undefined, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MigrationNotPossibleError);
    }

    this.name = 'MigrationNotPossibleError';
    this.message = `Migration to this version is not possible (${JSON.stringify(from)} -> ${JSON.stringify(to)}).`;
  }
}

class VersionMismatchError extends Error {
  constructor(from = undefined, to = undefined, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, VersionMismatchError);
    }

    this.name = 'VersionMismatchError';
    this.message = `Nonsensical migration path (${JSON.stringify(from)} -> ${JSON.stringify(to)}).`;
  }
}

class MigrationStepError extends Error {
  constructor(version = undefined, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MigrationStepError);
    }

    this.name = 'MigrationStepError';
    this.message = `Migration step failed (${JSON.stringify(version)}).`;
  }
}

module.exports = {
  VersionMismatchError,
  MigrationNotPossibleError,
  MigrationStepError,
};
