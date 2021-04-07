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
		process.env.CIRCLECI ? this._isLocal = true : this._isLocal = false
	}
	/**
	 * A globally unique id representing for the pipeline
	 */
	get id(): string {
		return "local"
	}
	/**
	 * A project unique integer id for the pipeline
	 */
	get number(): number {
		return 0
	}
	/**
	 * Project metadata
	 */
	project: Project = new Project()
	/**
	 * Git metadata
	 */
	git: Git = new Git()
}
export {PipelineParameter}