import * as CircleCI from "../src/index"
import * as YAML from "yaml"

describe("Instantiate Workflow", () => {
	const docker = new CircleCI.Executor.DockerExecutor("docker-executor", "cimg/node:lts")
	const helloWorld = new CircleCI.Command.Run({
		command: "echo hello world"
	})
	const job = new CircleCI.Job("my-job", docker, [helloWorld])
	const myWorkflow = new CircleCI.Workflow("my-workflow")
	myWorkflow.addJob(job)
	const generatedWorkflow = myWorkflow.generate()
	const expected =
`my-workflow:
  jobs:
    - my-job:
        name: my-job`
	it("Should match the expected output", () => {
		expect(generatedWorkflow).toEqual(YAML.parse(expected))
	})
})