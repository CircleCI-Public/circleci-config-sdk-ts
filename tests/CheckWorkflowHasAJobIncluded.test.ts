import * as CircleCI from '../src/index';
// Enforce local testing
delete process.env.CIRCLECI;
describe('Check workflow includes at least one job', () => {
  const myWorkflow = new CircleCI.Workflow('my-workflow');

  it('Workflow should have at least one job included', () => {
    expect(myWorkflow.jobs.length).toBeGreaterThanOrEqual(1);
  });
});
