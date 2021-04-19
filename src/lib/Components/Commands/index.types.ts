import { ParameterTypes } from "../../Config/index.types"
import { Component } from "../index.types"
import { RunCommandSchema } from "./Native/Run"

/**
 * Abstract - A generic Command
 */
export abstract class Command extends Component {
	type: string
	abstract parameters?: CommandParameters
	constructor(type: string) {
		super()
		this.type = type
	}
}

export interface CommandParameters {
	/**
	* Title of the step to be shown in the CircleCI UI (default: full command)
	*/
	name?: string
	[key: string]: ParameterTypes
}

export type CommandSchema = RunCommandSchema