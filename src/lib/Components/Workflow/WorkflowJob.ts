import { Component } from "../index.types"
import { Job } from "../Job"
import { WorkflowJobParameters, WorkflowJobSchema } from "./index.types"

/**
 * Assign Parameters and Filters to a Job within a Workflow
 */
export class WorkflowJob extends Component {
	job: Job
	parameters?: WorkflowJobParameters
	constructor(job: Job, parameters: WorkflowJobParameters) {
		super()
		this.job = job
		if (parameters) {
			this.parameters = parameters
		}
	}
	requiresJob(workflowJob: WorkflowJob): this {
		if (! this.parameters) {this.parameters = {}}
		if (! this.parameters.requires) {this.parameters.requires = []}
		this.parameters.requires.push(workflowJob.parameters?.name ?? workflowJob.job.name)
		return this
	}
	generate(): WorkflowJobSchema {
		let result
		if (this.parameters) {
			result = {
				[this.job.name]: this.parameters
			}
		} else {
			result = {
				[this.job.name]: {}
			}
		}
		return result
	}
}