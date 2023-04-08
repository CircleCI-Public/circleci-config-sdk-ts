import * as CircleCI from "@circleci/circleci-config-sdk";

// A function that returns an executor for a given version of Node. Optionally configure the resource class.
const nodeExecutor = (
  version: string,
  resourceSize: CircleCI.types.executors.executor.AnyResourceClassBase = "small",
) => new CircleCI.executors.DockerExecutor(`cimg/node:${version}`, resourceSize);

export { nodeExecutor }