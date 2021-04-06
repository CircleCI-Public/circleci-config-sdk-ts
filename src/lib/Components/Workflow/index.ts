import { Job } from "../Job"
import { WorkflowJobParameters, WorkflowJobSchema, WorkflowSchema } from "./index.types"
import { WorkflowJob } from "./WorkflowJob"

/**
 * A workflow is a set of rules for defining a collection of jobs and their run order.
 */
export class Workflow {
	name: string
	jobs: WorkflowJob[] = []

	constructor(name: string, jobs?: Job[]) {
		this.name = name
		jobs?.forEach(job => {
			this.jobs.push(new WorkflowJob(job))
		})
	}

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