import * as CircleCI from "@circleci/circleci-config-sdk";

const nodeExecutor = new CircleCI.executors.DockerExecutor(
  `cimg/node:19.8.1`,
  "small"
);

export { nodeExecutor }