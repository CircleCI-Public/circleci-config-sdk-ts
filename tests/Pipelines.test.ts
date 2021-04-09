import * as CircleCI from "../src/index"
import { PipelineParameter } from "../src/lib/Config/Pipeline"
describe("Check built-in pipeline parameters", () => {
	const myConfig = new CircleCI.Config()
	it("Should return pipeline id", () => {
		// On a local machine the pipeline id should return local
		expect(myConfig.pipeline.id).toEqual("local")
	})
	it("Should return pipeline number", () => {
		// On a local machine the pipeline number should return 0
		expect(myConfig.pipeline.number).toEqual(0)
	})
	it("Should return git tag", () => {
		// On a local machine the pipeline git tag should be local
		expect(myConfig.pipeline.git.tag).toEqual("local")
	})
	it("Should return git branch", () => {
		// On a local machine the pipeline git branch should be local
		expect(myConfig.pipeline.git.branch).toEqual("local")
	})
	it("Should return git revision", () => {
		// On a local machine the pipeline git revision should be 40 char long
		expect(myConfig.pipeline.git.revision.length).toEqual(40)
	})
	it("Should return git base_revision", () => {
		// On a local machine the pipeline git base_revision should be 40 char long
		expect(myConfig.pipeline.git.base_revision.length).toEqual(40)
	})
	it("Should return project git_url", () => {
		// On a local machine the project git_url should be "git.local"
		expect(myConfig.pipeline.project.git_url).toEqual("git.local")
	})
	it("Should return project type", () => {
		// On a local machine the project git_url should be "local"
		expect(myConfig.pipeline.project.type).toEqual("local")
	})
})

describe("Implement type-safe pipeline parameters", () => {
	const DockerExecutor = new CircleCI.Executor.DockerExecutor("dockerExecutor", "cimg/base:stable")
	const myJob = new CircleCI.Job("myJob", DockerExecutor)

	const stringParameter = new PipelineParameter("myParameter", "my-string-value")
	const booleanParamter = new PipelineParameter("myBoolean", true)
	const enumParamerer = new PipelineParameter("myEnum", "test", ["all", "possible", "values", "test"])

	const echoCommand = new CircleCI.Command.Run({
		command: `echo hello ${stringParameter.value}`
	})

	if (booleanParamter.value == false) {
		myJob.addStep(echoCommand)
	}

	expect(myJob.steps.length).toEqual(0)
	expect(stringParameter.type).toEqual("string")
	expect(booleanParamter.type).toEqual("boolean")
	expect(enumParamerer.value).toEqual("test")

})

describe("Generate valid Pipeline Parameter YAML", () => {
	const stringParameter = new PipelineParameter("myParameter", "my-string-value")
	const generated = stringParameter.generate()
	console.log(generated)
	expect(generated).toEqual("X")
})