import CircleCI from "../src/index"

describe("Instantiate a Run step", () => {
	const run = new CircleCI.Command.Run({
		command: "echo hello world"
	})
	const runStep = run.generate()
	const expectedResult = {"run": {"command": "echo hello world"}}
	it("Should genreate checkout yaml", () => {
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

describe("Save and load cache", () => {
	it("Should generate save cache yaml", () => {
		const example = {"save_cache":{"key":"v1-myapp-{{ arch }}-{{ checksum \"project.clj\" }}","paths":["/home/ubuntu/.m2"]}}
		const saveCache = new CircleCI.Command.Cache.Save({key: "v1-myapp-{{ arch }}-{{ checksum \"project.clj\" }}", paths: ["/home/ubuntu/.m2"]})
		expect(example).toEqual(saveCache.generate())
	})
	it("Should generate restore cache yaml", () => {
		const example = {"restore_cache":{"keys":["v1-npm-deps-{{ checksum \"package-lock.json\" }}","v1-npm-deps-"]}}
		const restoreCache = new CircleCI.Command.Cache.Restore({keys: ["v1-npm-deps-{{ checksum \"package-lock.json\" }}","v1-npm-deps-"]})
		expect(example).toEqual(restoreCache.generate())
	})
})

describe("Store artifacts", () => {
	it("Should generate the store artifacts command", () => {
		const example = {"store_artifacts":{"path":"jekyll/_site/docs/","destination":"circleci-docs"}}
		const storeArtifacts = new CircleCI.Command.StoreArtifacts({path:"jekyll/_site/docs/", destination: "circleci-docs"})
		expect(example).toEqual(storeArtifacts.generate())
	})
})