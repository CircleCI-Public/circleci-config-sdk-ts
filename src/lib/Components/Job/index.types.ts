//import { Command } from "../Commands/index.types"

export interface JobSchema {
	[key: string]: {
		executor: {
			name: string
		}
		steps: unknown//Command[]
	}
}