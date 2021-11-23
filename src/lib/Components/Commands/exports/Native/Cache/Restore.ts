import { ListParameter } from '../../../../Parameters/types/Parameters.types';
import { CommandParameters, CommandShape } from '../../../types/Command.types';
import { Command } from '../../Command';
/**
 * Restores a previously saved cache based on a key..cache needs to have been saved first for this key using save_cache step. Learn more in the caching documentation.
 */
export class Restore extends Command {
  parameters: RestoreCacheParameters;
  constructor(parameters: RestoreCacheParameters) {
    super('Restore_cache');
    this.parameters = parameters;
  }
  /**
   * Generate Restore.cache Command schema.
   * @returns The generated JSON for the Restore.cache Commands.
   */
  generate(): RestoreCacheCommandShape {
    return {
      restore_cache: { ...this.parameters },
    };
  }
}

/**
 * Command parameters for the RestoreCache command
 */
export interface RestoreCacheParameters extends CommandParameters {
  /**
   * List of cache keys to lookup for a cache to restore. Only first existing key will be restored.
   */
  readonly keys: ListParameter;
}
/**
 * JSON Schema for the RestoreCache command.
 */
interface RestoreCacheCommandShape extends CommandShape {
  restore_cache: RestoreCacheParameters;
}
