import * as CircleCI from '../src/index';

// This is a negative test that will pass if no job has been added to the config

// Enforce local testing
delete process.env.CIRCLECI;
describe('stringify', () => {
  it('should test the handleError', () => {
    const myConfig = new CircleCI.Config();
    expect(() => myConfig.stringify()).toThrow(
      'There are no jobs defined in this pipeline. A pipeline must have at least one job defined',
    ); // Success!
  });
});
