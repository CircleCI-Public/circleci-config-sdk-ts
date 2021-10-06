import * as CircleCI from '../src/index';

// This is a negative test that will pass if no job has been included in the workflow

// Enforce local testing
delete process.env.CIRCLECI;
describe('Check is workflow includes no jobs', () => {
  const myWorkflow = new CircleCI.Workflow('my-workflow');

  it('Workflow should have no jobs included', () => {
    expect(myWorkflow.jobs.length).toEqual(0);
  });
});
