import { Component } from "../index.types"
import { DockerExecutor } from "./DockerExecutor"
import { DockerExecutorSchema } from "./DockerExecutor.types"
/**
 * A generic reusable Executor
 */
export abstract class Executor extends Component {
	name: string
	description?: string
	constructor(name: string, description?: string) {
		super()
		this.name = name
		this.description = description
	}
	abstract generate(): ExectorSchema
}

export type ExecutorType = DockerExecutor
export type ExectorSchema = DockerExecutorSchema