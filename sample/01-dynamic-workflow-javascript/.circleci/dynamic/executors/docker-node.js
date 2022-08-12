const CircleCI = require("@circleci/circleci-config-sdk");
const dockerNode = new CircleCI.executors.DockerExecutor(
  "docker-node",
  "cimg/node:lts"
);
module.exports = dockerNode;
