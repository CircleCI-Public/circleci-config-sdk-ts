import { Command } from "../Components/Commands/index.types"
import { Job } from "../Components/Job"
import { Workflow } from "../Components/Workflow"
import { CircleCIConfigObject, CircleCIConfigSchema, ConfigVersion } from "./index.types"

import { Executor } from "../Components"

import YAML from "yaml"
import { ExectorSchema } from "../Components/Executor/index.types"
import { JobSchema } from "../Components/Job/index.types"
import { WorkflowSchema } from "../Components/Workflow/index.types"
import { Pipeline } from "./Pipeline"

/**
 * A CircleCI configuration
 */
export class Config implements CircleCIConfigObject {
		version: ConfigVersion = 2.1
		executors: Executor[] = []
		jobs: Job[] = []
		commands: Command[] = []
		workflows: Workflow[] = []
		pipeline: Pipeline = new Pipeline()

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

		addExecutor(executor: Executor): this {
			this.executors.push(executor)
			return this
		}

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
		 * Export a dockerfile as a string
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