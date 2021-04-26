import { Command } from "../Commands/index.types"
import { DockerExecutor } from "../Executor/DockerExecutor"
import { ExecutorType } from "../Executor/index.types"
import Component from "../index.types"
import { JobSchema } from "./index.types"

/**
 * Jobs define a collection of steps to be run within a given executor, and are orchestrated using Workflows.
 */
export class Job extends Component {
	name: string;
	executor: DockerExecutor;
	steps: Command[] = [];
	constructor(name: string, executor: ExecutorType, steps?: Command[]) {
		super()
		this.name = name
		this.executor = executor
		this.steps = steps || []
	}

	generate(): JobSchema {
		const generatedSteps = this.steps.map((step) => {
			return step.generate()
		})
		return {
			[this.name]: {
				executor: {
					name: this.executor.name,
				},
				steps: generatedSteps,
			},
		}
	}

	/**
	 * Add steps to the current Job. Chainable.
	 * @param command - Command to use for step
	 */
	addStep(command: Command): this {
		this.steps.push(command)
		return this
	}
}
export default Job
