import { Component } from "../index.types"
import { RunCommandSchema } from "./Native/Run"

/**
 * Abstract - A generic Command
 */
export abstract class Command extends Component {
	type: string
	abstract parameters?: unknown
	constructor(type: string) {
		super()
		this.type = type
	}
}

export type CommandSchema = RunCommandSchema