import * as CircleCI from '@circleci/circleci-config-sdk';
import { testJob, deployJob } from './jobs';
import { isDeployable } from './utils';

// Create a new config and workflow
const myConfig = new CircleCI.Config();
const myWorkflow = new CircleCI.Workflow('my-workflow');

// Support the three latest versions of Node
const nodeVersions = ["16.19", "18.13", "19.7"];

// Create a test job for each version of Node and add it to the config and workflow
const testJobs = nodeVersions.map((version) => testJob(version));
testJobs.forEach((job) => {
  myConfig.addJob(job);
  myWorkflow.addJob(job)
});

// If it's a deployable day, add the deploy job to the config and workflow
if (isDeployable()) {
  myConfig.addJob(deployJob);
  myWorkflow.addJob(deployJob, {
    requires: testJobs.map((job) => job.name)
  });
}

// Add the workflow to the config
myConfig.addWorkflow(myWorkflow);

// Write the config to a file
myConfig.writeFile('dynamicConfig.yml')
