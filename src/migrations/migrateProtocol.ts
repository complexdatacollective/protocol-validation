import getMigrationPath from "./getMigrationPath";
import { MigrationStepError } from "./errors";
import { Protocol } from "@codaco/shared-consts";

export type ProtocolMigration = {
  version: number;
  notes?: string;
  migration: (protocol: Protocol) => Protocol;
};

const migrateStep = (protocol: Protocol, step: ProtocolMigration) => {
  const { version, migration } = step;
  try {
    return migration(protocol);
  } catch (e) {
    if (e instanceof Error) {
      throw new MigrationStepError(version, e);
    }

    throw e;
  }
};

export const migrateProtocol = (
  protocol: Protocol,
  targetSchemaVersion: number,
) => {
  // Get migration steps between versions
  const migrationPath = getMigrationPath(
    protocol.schemaVersion,
    targetSchemaVersion,
  );

  // Perform migration
  const updatedProtocol = migrationPath.reduce(migrateStep, protocol);

  const resultProtocol = {
    ...updatedProtocol,
    schemaVersion: targetSchemaVersion,
  };

  const { migrations } = migrationPath.reduce(
    (acc, { version }) => {
      return {
        previous: version,
        migrations: [...acc.migrations, [acc.previous, version]],
      };
    },
    { previous: protocol.schemaVersion, migrations: [] },
  );

  return [resultProtocol, migrations];
};
