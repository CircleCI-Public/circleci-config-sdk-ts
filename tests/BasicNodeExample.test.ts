import * as CircleCI from "../src/index"
import * as YAML from "yaml"
describe("Generate a Hello World config", () => {
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

	// const configOutputFile = myConfig.stringify()
	it("Should generate a valid config file", () => {
		const expectedResult = {"version":2.1,"executors":{"node-executor":{"docker":[{"image":"cimg/node:lts"}]}},"jobs":{"node-test":{"executor":{"name":"node-executor"},"steps":[{"run":{"command":"npm install","name":"NPM Install"}},{"run":{"command":"npm run test","name":"Run tests"}}]}},"workflows":{"myWorkflow":{"jobs":[{"node-test":{}}]}}}
		const configYAML = myConfig.stringify()
		expect(YAML.parse(configYAML)).toEqual(expectedResult)
	})
})