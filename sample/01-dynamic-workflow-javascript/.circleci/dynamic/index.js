const CircleCI = require("@circleci/circleci-config-sdk");
const fs = require('fs');

// Import Config Components
const dockerNode = require("./executors/docker-node");
const jobA = require("./jobs/jobA");
const jobB = require("./jobs/jobB");

// Initiate a new Config
const myConfig = new CircleCI.Config()

// Add elements to the config
myConfig.addExecutor(dockerNode)
  .addJob(jobA)
  .addJob(jobB)

// Instantiate new Workflow and add jobA
const dynamicWorkflow = new CircleCI.Workflow("dynamic-workflow");
dynamicWorkflow.addJob(jobA);

// Conditionally add jobB
if (1 == 1) {
  dynamicWorkflow.addJob(jobB);
}

// Add the dynamic workflow to the config
myConfig.addWorkflow(dynamicWorkflow);

// New Config file
const MyNewConfigYAML = myConfig.stringify();

// Write the config to file
fs.writeFile('./dynamicConfig.yml', MyNewConfigYAML, (err) => {
  if (err) {
    console.log(err);
    return
  }
})

