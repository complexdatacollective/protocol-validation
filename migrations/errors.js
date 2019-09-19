class VersionNotFoundError extends Error {
  constructor(version = undefined, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, VersionNotFoundError);
    }

    this.name = 'VersionNotFoundError';
    this.message = `Protocol version ${JSON.stringify(version)} not found.`;
  }
}

class MigrationNotPossibleError extends Error {
  constructor(from = undefined, to = undefined, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MigrationNotPossibleError);
    }

    this.name = 'MigrationNotPossibleError';
    this.message = `Migration to this version is not possible from ${JSON.stringify(from)} to ${JSON.stringify(to)}.`;
  }
}

class VersionOutmatchError extends Error {
  constructor(from = undefined, to = undefined, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, VersionOutmatchError);
    }

    this.name = 'MigrationNotPossibleError';
    this.message = `Source version (${JSON.stringify(from)}) outmatches target version(${JSON.stringify(to)}).`;
  }
}

module.exports = {
  VersionNotFoundError,
  VersionOutmatchError,
  MigrationNotPossibleError,
};
