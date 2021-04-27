import { Command } from "../Components/Commands/index.types"
import Job from "../Components/Job"
import Workflow from "../Components/Workflow"
import { CircleCIConfigObject, CircleCIConfigSchema, ConfigVersion } from "./index.types"

import Executor from "../Components/Executor/index.types"

import YAML from "yaml"
import { ExectorSchema } from "../Components/Executor/index.types"
import { JobSchema } from "../Components/Job/index.types"
import { WorkflowSchema } from "../Components/Workflow/index.types"
import Pipeline  from "./Pipeline"

/**
 * A CircleCI configuration. Instantiate a new config and add CircleCI config elements.
 */
export class Config implements CircleCIConfigObject {
		/**
		 * The version field is intended to be used in order to issue warnings for deprecation or breaking changes.
		 */
		version: ConfigVersion = 2.1
		/**
		 * Executors define the environment in which the steps of a job will be run, allowing you to reuse a single executor definition across multiple jobs.
		 */
		executors: Executor[] = []
		/**
		 * Jobs are collections of steps. All of the steps in the job are executed in a single unit, either within a fresh container or VM.
		 */
		jobs: Job[] = []
		/**
		 * A command definition defines a sequence of steps as a map to be executed in a job, enabling you to reuse a single command definition across multiple jobs.
		 */
		commands: Command[] = []
		/**
		 * A Workflow is comprised of one or more uniquely named jobs.
		 */
		workflows: Workflow[] = []
		/**
		 * Access information about the current pipeline.
		 */
		pipeline: Pipeline = new Pipeline()

		/**
		 * Instantiate a new CircleCI config. Build up your config by adding components.
		 * @param jobs - Instantiate with pre-defined Jobs.
		 * @param workflows - Instantiate with pre-defined Workflows.
		 * @param executors - Instantiate with pre-defined reusable Executors.
		 * @param commands - Instantiate with pre-defined reusable Commands.
		 */
		constructor(jobs?: Job[], workflows?: Workflow[], executors?: Executor[], commands?: Command[]) {
			this.jobs.concat(jobs || [])
			this.workflows.concat(workflows || [])
			this.executors = executors || []
			this.commands = commands || []
		}

		/**
		 * Add a Workflow to the current Config. Chainable
		 * @param workflow - Injectable Workflow
		 */
		addWorkflow(workflow: Workflow): this {
			this.workflows.push(workflow)
			return this
		}
		/**
		 * Add an Executor to the current Config. Chainable
		 * @param executor - Injectable executor
		 */
		addExecutor(executor: Executor): this {
			this.executors.push(executor)
			return this
		}
		/**
		 * Add a Job to the current Config. Chainable
		 * @param job - Injectable Job
		 */
		addJob(job: Job): this {
			// Abstract rules later
			if (this.executors.find(x => x.name == job.executor.name)) {
				this.jobs.push(job)
			} else {
				throw new Error("The selected executor has not yet been added to the config file. Make sure you have first called addExecutor.")
			}
			return this
		}

		/**
		 * Export the CircleCI configuration as a YAML string.
		 */
		stringify(): string {
			const generatedExecutorConfig: ExectorSchema = {}
			this.executors.forEach(executor => {Object.assign(generatedExecutorConfig, executor.generate())})

			const generatedJobConfig: JobSchema = {}
			this.jobs.forEach(job => {Object.assign(generatedJobConfig, job.generate())})

			const generatedWorkflowConfig: WorkflowSchema = {}
			this.workflows.forEach(workflow => {Object.assign(generatedWorkflowConfig, workflow.generate())})

			const generatedConfig: CircleCIConfigSchema = {
				version: this.version,
				executors: generatedExecutorConfig,
				jobs: generatedJobConfig,
				workflows: generatedWorkflowConfig,
			}
			return YAML.stringify(generatedConfig)
		}

}
export default Config