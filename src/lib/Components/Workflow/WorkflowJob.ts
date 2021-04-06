import { Component } from "../index.types"
import { Job } from "../Job"
import { WorkflowJobParameters, WorkflowJobSchema } from "./index.types"

/**
 * Assign Parameters and Filters to a Job within a Workflow
 */
export class WorkflowJob extends Component {
	job: Job
	parameters: WorkflowJobParameters = {name: ""}
	constructor(job: Job, parameters?: WorkflowJobParameters) {
		super()
		this.job = job
		this.parameters = parameters || {name: this.job.name}
		this.parameters.name = parameters?.name || this.job.name
	}
	requiresJob(workflowJob: WorkflowJob): this {
		if (! this.parameters.requires) {this.parameters.requires = []}
		this.parameters.requires.push(workflowJob.parameters.name)
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