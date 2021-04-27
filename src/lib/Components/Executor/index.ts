import {DockerExecutor} from "./DockerExecutor"

/**
 * Executors define the environment in which the steps of a job will be run. {@link https://circleci.com/docs/2.0/configuration-reference/#executors-requires-version-21}
 */
export {
	/**
	 * A Docker based CircleCI executor {@link https://circleci.com/docs/2.0/configuration-reference/?section=configuration#docker}
	 */
	DockerExecutor,
}