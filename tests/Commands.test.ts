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

describe("Instantiate a Checkout step", () => {
	const checkout = new CircleCI.Command.Checkout()
	it("Should produce checkout string", () => {
		expect(checkout.generate()).toEqual("checkout")
	})

	const checkoutWithPath = new CircleCI.Command.Checkout({path: "./src"})
	it("Should produce checkout with path parameter", () => {
		expect(checkoutWithPath.generate()).toEqual({"checkout":{"path":"./src"}})
	})
})