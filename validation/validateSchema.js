const { v1 } = require('../schemas/');

/**
 * Statically validate the protocol based on its JSON schema
 */
const validateSchema = (protocol, validate = v1) => {
  validate(protocol, 'Protocol');
  return validate.errors || [];
};

module.exports = validateSchema;
