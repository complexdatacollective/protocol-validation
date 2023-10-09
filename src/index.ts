import { validateSchema } from "./validation/validateSchema";
import { validateLogic } from "./validation/validateLogic";
import { Protocol } from "@codaco/shared-consts";

export class ValidationError extends Error {
  public schemaErrors: string[];
  public logicErrors: string[];

  constructor(message: string, schemaErrors: string[], logicErrors: string[]) {
    super(message);
    this.name = "ValidationError";
    this.schemaErrors = schemaErrors;
    this.logicErrors = logicErrors;
  }
}

const validateProtocol = async (
  protocol: Protocol,
  forceSchemaVersion?: number,
) => {
  if (protocol === undefined) {
    throw new Error("Protocol is undefined");
  }

  const schemaResult = await validateSchema(protocol, forceSchemaVersion);
  const logicResult = validateLogic(protocol);

  if (!(schemaResult instanceof Error) && !(logicResult instanceof Error)) {
    const { hasErrors: hasSchemaErrors, errors: schemaErrors } = schemaResult;
    const { hasErrors: hasLogicErrors, errors: logicErrors } = logicResult;
    if (hasSchemaErrors || hasLogicErrors) {
      throw new ValidationError(
        "Protocol is invalid!",
        schemaErrors,
        logicErrors,
      );
    }
  } else {
    throw new Error(
      `Protocol validation failed due to an internal error: ${schemaResult}}`,
    );
  }

  return;
};

export { validateSchema, validateLogic, validateProtocol };
