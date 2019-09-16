/* eslint-env jest */

const migrateProtocol = require('../migrateProtocol');
const migrations = require('../migrations');
const errors = require('../errors');

jest.mock('../migrations');

/**
 * Migrations are run in the order that they are defined relative to one another
 * e.g. 1 -> 3, will run 1 -> 2 -> 3
 */
migrations.push({ version: '1', migration: jest.fn(protocol => protocol) });
migrations.push({ version: '2', migration: jest.fn(protocol => ({ ...protocol, foo: 'bar', bazz: 'buzz' })) });
migrations.push({ version: '3', migration: jest.fn(({ foo, ...protocol }) => ({ ...protocol, fizz: 'pop' })) });
migrations.push({ version: '4', migration: null });
migrations.push({ version: '5', migration: jest.fn(protocol => protocol) });

const mockProtocol = {
  schemaVersion: '1',
};

describe('migrateProtocol', () => {
  beforeEach(() => {
    // reset mocks
    migrations.forEach(({ migration }) => migration.mockClear());
  });

  it('runs migrations from protocol schema version to target schema version', () => {
    migrateProtocol(mockProtocol, '3');

    expect(migrations[0].migration.mock.calls.length).toBe(0); // version: '1'
    expect(migrations[1].migration.mock.calls.length).toBe(1); // version: '2'
    expect(migrations[2].migration.mock.calls.length).toBe(1); // version: '3'
    expect(migrations[3].migration.mock.calls.length).toBe(0); // version: '4'
  });

  it('runs migrations from protocol schema version to target schema version', () => {
    migrateProtocol({ schemaVersion: '4' }, '5');

    expect(migrations[3].migration.mock.calls.length).toBe(0); // version: '4'
    expect(migrations[4].migration.mock.calls.length).toBe(1); // version: '5'
  });

  it('migrations transform protocol successively', () => {
    const resultProtocol = migrateProtocol(mockProtocol, '3');

    expect(resultProtocol).toEqual({ bazz: 'buzz', fizz: 'pop', schemaVersion: '3' });
  });

  it('throws an error if schema version cannot be found', () => {
    expect(() => {
      migrateProtocol({
        schemaVersion: '-999',
      }, '2');
    }).toThrow(errors.CurrentProtocolNotFoundError);
  });

  it('throws an error if target version cannot be found', () => {
    expect(() => {
      migrateProtocol(mockProtocol, '-999');
    }).toThrow(errors.TargetProtocolNotFoundError);
  });

  it('throws an error migration run on a blocking migration path', () => {
    expect(() => {
      migrateProtocol(mockProtocol, '4');
    }).toThrow(errors.MigrationNotPossibleError);
  });
});
