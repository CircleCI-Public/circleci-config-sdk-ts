import { ParameterTypes } from "../index.types"
import { ParameterTypeLiteral } from "./index.types"

export class PipelineParameter<ParameterType extends ParameterTypes> {
	name: string
	defaultValue: ParameterType
	type: ParameterTypeLiteral
	constructor(name: string, defaultValue: ParameterType, type: ParameterTypeLiteral) {
		this.name = name
		this.defaultValue = defaultValue
		this.type = type
	}

	get value(): ParameterType {
		// Needs a way of getting the "current" value from the environment.
		return this.defaultValue
	}
}