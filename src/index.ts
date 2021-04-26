import Command from "./lib/Components/Commands"
import Executor from "./lib/Components/Executor"
import Job from "./lib/Components/Job"
import Workflow from "./lib/Components/Workflow"
import Config from "./lib/Config"
import Pipeline from "./lib/Config/Pipeline/index"

/**
 * The CircleCI config SDK.
 */
const CircleCI = {
	Command,
	/**
	 * Executors define the environment in which the steps of a job will be run. {@link https://circleci.com/docs/2.0/configuration-reference/#executors-requires-version-21}
	 */
	Executor,
	/**
	 * Jobs define a collection of steps to be run within a given executor, and are orchestrated using Workflows.
	 */
	Job,
	/**
 	* A workflow is a set of rules for defining a collection of jobs and their run order.
 	*/
	Workflow,
	/**
	 * Access information about the Current CircleCI Pipeline
	 */
	Pipeline,
	/**
	 * A CircleCI configuration
	 */
	Config
}

// Exported for documentation
export {
	Command,
	Executor,
	Job,
	Workflow,
	Pipeline,
	Config
}

export default CircleCI