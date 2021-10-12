const CircleCI = require("@circleci/circleci-config-sdk");
const dockerNode = require("../executors/docker-node");

const jobB = new CircleCI.Job("jobB", dockerNode);
jobB.addStep(new CircleCI.Commands.Run({ command: "echo hello from Job B" }));

module.exports = jobB;
