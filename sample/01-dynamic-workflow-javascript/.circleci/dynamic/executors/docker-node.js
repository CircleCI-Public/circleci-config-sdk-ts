const CircleCI = require("@circleci/circleci-config-sdk");
const dockerNode = new CircleCI.Executor.DockerExecutor(
  "docker-node",
  "cimg/node:lts"
);
module.exports = dockerNode;
