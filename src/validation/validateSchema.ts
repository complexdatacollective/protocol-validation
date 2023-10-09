import { Protocol } from "@codaco/shared-consts";
import type { ValidateFunction } from "ajv";

export const validateSchema = async (
  protocol: Protocol,
  forceVersion?: number,
) => {
  if (!protocol) {
    return new Error("Protocol is undefined");
  }

  const version = forceVersion || protocol.schemaVersion || null;

  if (!version) {
    return new Error(
      "Protocol does not have a schema version, and force version was not used",
    );
  }

  if (forceVersion) {
    console.log(`Forcing validation against schema version ${version}`);
  }

  let validator: ValidateFunction;

  try {
    validator = await import(`./schemas/${version}.js`).then(
      (module) => module.default,
    );
  } catch (e) {
    return new Error(`Couldn't find validator for schema version ${version}.`);
  }

  // Validate
  if (!validator(protocol)) {
    const errorMessages = validator.errors?.map((error) => {
      return `${error.instancePath}: ${error.message}`;
    });

    return {
      hasErrors: true,
      errors: errorMessages || ["No error messages were available"],
    };
  }

  return {
    hasErrors: false,
    errors: [],
  };
};
