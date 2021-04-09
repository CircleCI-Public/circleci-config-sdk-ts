import {Project} from "./Project"
import {Git} from "./Git"
import { PipelineParameter } from "./Parameters"
import { ParameterTypes } from "../index.types"
export class Pipeline {
	/**
	 * Pipeline parameter values are passed at the config level on CircleCI. These values will not be present on a local system.
	 */
	private _isLocal = true
	/**
	 * Array of user defined parameters
	 */
	parameters: PipelineParameter<ParameterTypes>[] = []
	constructor() {
		process.env.CIRCLECI ? this._isLocal = false : this._isLocal = true
	}
	/**
	 * A globally unique id representing for the pipeline
	 * @beta
	 */
	get id(): string {
		if (this._isLocal) {
			return "local"
		} else {
			return "NOT YET SUPPORTED"
		}
	}
	/**
	 * A project unique integer id for the pipeline
	 * @beta
	 */
	get number(): number {
		if (this._isLocal) {
			return 0
		} else {
			return -1
		}
	}
	/**
	 * Project metadata
	 */
	project: Project = new Project(this._isLocal)
	/**
	 * Git metadata
	 */
	git: Git = new Git(this._isLocal)
}
export {PipelineParameter}