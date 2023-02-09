const CircleCI = require("@circleci/circleci-config-sdk");
const dockerNode = new CircleCI.executors.DockerExecutor(
  "cimg/node:lts",
  "medium"
);
module.exports = dockerNode;
