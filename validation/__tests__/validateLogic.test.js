/* eslint-env jest */

const validateLogic = require('../validateLogic');
const protocolWithUndefinedNodes = require('./protocolWithUndefinedNodes.json');
protocolWithUndefinedNodes.stages[0].skipLogic.filter.rules = undefined;

describe('validateLogic', () => {
  it('It can accept an invalid protocol', () => {
    expect(() => {
      validateLogic(protocolWithUndefinedNodes)
    }).not.toThrow();
  });
})
