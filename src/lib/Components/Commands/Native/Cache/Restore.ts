import { Command, CommandParameters } from "../../index.types"
/**
 * Restores a previously saved cache based on a key. Cache needs to have been saved first for this key using save_cache step. Learn more in the caching documentation.
 */
export class Restore extends Command {
	parameters: RestoreCacheParameters
	constructor(parameters: RestoreCacheParameters) {
		super("Restore_cache")
		this.parameters = parameters
	}
	generate(): RestoreCacheCommandSchema {
		return {restore_cache: {...this.parameters}} as RestoreCacheCommandSchema
	}
}

export interface RestoreCacheParameters extends CommandParameters {
	/**
	 * List of cache keys to lookup for a cache to restore. Only first existing key will be restored.
	 */
	keys: string[]
}

export interface RestoreCacheCommandSchema {
	restore_cache: RestoreCacheParameters
}