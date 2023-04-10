import * as CircleCI from "@circleci/circleci-config-sdk";
import { nodeExecutor } from "../executors";

// A function that returns a test job for a given version of Node with a unique name
const testJob = (version: string) =>
  new CircleCI.Job(`test-${version.replace('.', '-')}`, nodeExecutor(version), [
    new CircleCI.commands.Checkout(),
    new CircleCI.commands.Run({
      command: 'npm install && npm run test',
    }),
  ]);

const deployJob = new CircleCI.Job(
  "deploy",
  nodeExecutor("18"),
  [
    new CircleCI.commands.Checkout(),
    new CircleCI.commands.Run({
      command: "npm install && npm run deploy"
    })
  ]
)

export { testJob, deployJob }