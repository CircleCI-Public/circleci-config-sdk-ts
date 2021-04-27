# CircleCI Config SDK (TypeScript)

Create and manage your CircleCI config with JavaScript and TypeScript.

[View the SDK Docs](https://furry-adventure-3f2b45c4.pages.github.io/modules.html)

## Example

Generate a CircleCI config using TypeScript/Javascript, properly typed for full IntelliSense support.

```typescript
// Instantiate new Config
const myConfig = new CircleCI.Config()
// Create new Workflow
const myWorkflow = new CircleCI.Workflow("myWorkflow")
myConfig.addWorkflow(myWorkflow)

// Create an executor. Reusable.
const nodeExecutor = new CircleCI.Executor.DockerExecutor("node-executor", "cimg/node:lts")
myConfig.addExecutor(nodeExecutor)

// Create Job
const nodeTestJob = new CircleCI.Job("node-test", nodeExecutor)
myConfig.addJob(nodeTestJob)

// Add steps to job
nodeTestJob
	.addStep(new CircleCI.Command.Run({
		command: "npm install",
		name: "NPM Install"}))
	.addStep(new CircleCI.Command.Run({
		command: "npm run test",
		name: "Run tests"}))

// Add Jobs to Workflow
myWorkflow.addJob(nodeTestJob)

```

The `stringify()` function on the `Config` will return the CircleCI YAML equivalent.

```yaml
version: 2.1
executors:
  node-executor:
    docker:
			- image: cimg/node:lts
jobs:
  node-test:
    executor:
      name: node-executor
    steps:
			- run:
				command: npm install
				name: NPM Install
			- run:
				command: npm run test
				name: Run tests
workflows:
  myWorkflow:
    jobs:
			- node-test: {}
```