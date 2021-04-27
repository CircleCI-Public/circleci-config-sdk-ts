import { Command, CommandParameters } from "../../index.types"
/**
 * Generates and stores a cache of a file or directory of files such as dependencies or source code in our object storage. Later jobs can restore this cache.
 */
export class Save extends Command {
	parameters: SaveCacheParameters
	constructor(parameters: SaveCacheParameters) {
		super("save_cache")
		this.parameters = parameters
	}
	/**
	 * Generate Save Cache Command schema.
	 * @returns The generated JSON for the Save Cache Command.
	 */
	generate(): SaveCacheCommandSchema {
		return {save_cache: {...this.parameters}} as SaveCacheCommandSchema
	}
}
export default Save

export interface SaveCacheParameters extends CommandParameters {
	/**
	 * List of directories which should be added to the cache
	 */
	paths: string[]
	/**
	 * Unique identifier for this cache
	 */
	key: string
	/**
	 * Specify when to enable or disable the step.
	 */
	when?: "always" | "on_success" | "on_fail"
}

export interface SaveCacheCommandSchema {
	save_cache: SaveCacheParameters
}