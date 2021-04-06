import * as CircleCI from "../src/index"

describe("Instantiate a Run step", () => {
	const run = new CircleCI.Command.Run({
		command: "echo hello world"
	})
	const runStep = run.generate()
	const expectedResult = {"run": {"command": "echo hello world"}}
	it("Should match the expected output", () => {
		expect(runStep).toEqual(expectedResult)
	})
})