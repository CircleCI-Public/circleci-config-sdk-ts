import * as CircleCI from '../src/index';
// Enforce local testing
delete process.env.CIRCLECI;
describe('Check at least one job is defined', () => {
  const myConfig = new CircleCI.Config();
  it('Should return amount of jobs in config', () => {
    // make sure job count is greater than or equal to 1
    expect(myConfig.jobs.length).toBeGreaterThanOrEqual(1);
  });
});
