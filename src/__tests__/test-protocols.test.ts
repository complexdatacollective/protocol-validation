import { beforeEach, describe, expect, it } from "bun:test";
import { ValidationError, validateProtocol } from "../../dist";
import { readFile } from "fs/promises";
import { readdirSync } from "fs";
import { join } from "path";
import JSZip from "jszip";
import type Zip from "jszip";

export const getProtocolJsonAsObject = async (zip: Zip) => {
  const protocolString = await zip.file("protocol.json")?.async("string");

  if (!protocolString) {
    throw new Error("protocol.json not found in zip");
  }

  const protocol = await JSON.parse(protocolString);

  return protocol;
};

const extractAndValidate = async (protocolPath: string) => {
  // Preparing protocol...
  const buffer = await readFile(protocolPath);

  // Unzipping...
  const zip = await JSZip.loadAsync(buffer);

  const protocol = await getProtocolJsonAsObject(zip);

  // Hack because somme test protocols don't specify schema versions correctly
  let schemaVersion;
  if (!protocol.schemaVersion || protocol.schemaVersion === "1.0.0") {
    schemaVersion = 1;
  } else {
    schemaVersion = protocol.schemaVersion;
  }

  // Validating protocol...
  try {
    await validateProtocol(protocol, schemaVersion);
    return {
      error: undefined,
      errorDetails: [],
      success: true,
    };
  } catch (error) {
    console.log("validation error", error);
    if (error instanceof ValidationError) {
      return {
        protocol: protocolPath,
        schemaVersion: error.schemaVersion,
        forced: error.schemaForced,
        error: error.message,
        errorDetails: [...error.logicErrors, ...error.schemaErrors],
      };
    }

    throw error;
  }
};

const PROTOCOL_PATH = "../../test-protocols";
const protocols = readdirSync(join(__dirname, PROTOCOL_PATH));

describe("Test protocols", () => {
  it.each(protocols)("%s", async (protocol) => {
    const protocolPath = join(__dirname, PROTOCOL_PATH, protocol);
    const result = await extractAndValidate(protocolPath);

    expect(result).toEqual({
      error: undefined,
      errorDetails: [],
      success: true,
    });
  });
});
