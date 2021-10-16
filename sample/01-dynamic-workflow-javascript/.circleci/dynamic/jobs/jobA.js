const CircleCI = require("@circleci/circleci-config-sdk");
const dockerNode = require("../executors/docker-node");

const jobA = new CircleCI.Job("jobA", dockerNode);
jobA.addStep(new CircleCI.commands.Run({ command: "echo hello from Job A" }));

module.exports = jobA;
