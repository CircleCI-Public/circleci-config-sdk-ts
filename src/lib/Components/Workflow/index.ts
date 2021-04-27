import Job from "../Job"
import { WorkflowJobParameters, WorkflowJobSchema, WorkflowSchema } from "./index.types"
import { WorkflowJob } from "./WorkflowJob"

/**
 * A workflow is a set of rules for defining a collection of jobs and their run order.
 */
export class Workflow {
	/**
	 * The name of the Workflow.
	 */
	name: string
	/**
	 * The jobs to execute when this Workflow is triggered.
	 */
	jobs: WorkflowJob[] = []

	/**
	 * Instantiate a Workflow
	 * @param name - Name your workflow. Must be unique.
	 * @param jobs - A list of jobs to executute as part of your Workflow.
	 */
	constructor(name: string, jobs?: Job[]) {
		this.name = name
		jobs?.forEach(job => {
			this.jobs.push(new WorkflowJob(job))
		})
	}
	/**
	 * Generate Workflow schema.
	 * @returns The generated JSON for the Workflow.
	 */
	generate(): WorkflowSchema {
		const generatedWorkflowJobs: WorkflowJobSchema[] = []
		this.jobs.forEach(job => {
			generatedWorkflowJobs.push(job.generate())
		})
		return {
			[this.name]: {
				jobs: generatedWorkflowJobs
			}
		}
	}

	/**
	 * Add a Job to the current Workflow. Chainable
	 * @param workflowJob - Injectable Job with parameters
	 */
	addJob(job: Job, parameters?: WorkflowJobParameters): this {
		this.jobs.push(new WorkflowJob(job, parameters))
		return this
	}
}
export default Workflow