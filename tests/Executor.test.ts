import * as CircleCI from "../src/index"
import * as YAML from "yaml"

describe("Instantiate Docker Executor", () => {
	const docker = new CircleCI.Executor.DockerExecutor("docker-executor", "cimg/node:lts").generate()
	const expectedYAML =
`docker-executor:
  docker:
    - image: cimg/node:lts`

	it("Should match the expected output", () => {
		expect(docker).toEqual(YAML.parse(expectedYAML))
	})
})