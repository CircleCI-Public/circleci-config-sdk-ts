import { ParameterTypes } from "../../Config/index.types"

export interface WorkflowSchema {
	[workflowName: string]: {
		jobs: WorkflowJobSchema[]
	}
}

export interface WorkflowJobParameters {
	requires?: string[],
	name?: string,
	[key: string]: ParameterTypes
}

export interface WorkflowJobSchema {
	[workflowJobName: string]: {
		requires?: string[]
		context?: string[]
		type?: "approval"
		fitlers?: WorkflowFilterSchema
		matrix?: WorkflowMatrixSchema
	}
}

export interface WorkflowFilterSchema {
	/**
	 * Either a single branch specifier, or a list of branch specifiers
	 */
	branches?: {
		only?: string[]
		ignore?: string[]
	}
	/**
	 *
	 */
	tags?: {
		only?: string[]
		ignore?: string[]
	}
}

/**
 * A map of parameter names to every value the job should be called with
 */
export interface WorkflowMatrixSchema {
	parameters: {
		[key: string]: string[]
	}
}