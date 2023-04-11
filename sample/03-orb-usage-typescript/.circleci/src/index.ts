import * as CircleCI from '@circleci/circleci-config-sdk';
import { SlackOrb } from './orbs';
import { nodeExecutor } from './executors';

const myConfig = new CircleCI.Config();
const myWorkflow = new CircleCI.Workflow('my-workflow');
myConfig.importOrb(SlackOrb);

const myJob = new CircleCI.Job('example-job', nodeExecutor, [
  new CircleCI.commands.Checkout(),
  new CircleCI.commands.Run({ command: 'npm install' }),
  new CircleCI.commands.Run({ command: 'npm test' }),
  new CircleCI.reusable.ReusedCommand(SlackOrb.commands['notify'], {
    event: "pass",
    template: "basic_success_1",
  } )
]);

myConfig.addJob(myJob);
myWorkflow.addJob(myJob);

myConfig.addWorkflow(myWorkflow);
myConfig.writeFile('dynamicConfig.yml')
