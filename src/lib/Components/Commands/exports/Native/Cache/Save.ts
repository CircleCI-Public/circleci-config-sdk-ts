import {
  ListParameter,
  StringParameter,
} from '../../../../Parameters/types/Parameters.types';
import { CommandParameters, CommandShape } from '../../../types/Command.types';
import { Command } from '../../Command';

/**
 * Generates and stores a cache of a file or directory of files such as dependencies or source code in our object storage. Later jobs can restore this cache.
 */
export class Save extends Command {
  parameters: SaveCacheParameters;
  constructor(parameters: SaveCacheParameters) {
    super('save_cache');
    this.parameters = parameters;
  }
  /**
   * Generate Save Cache Command schema.
   * @returns The generated JSON for the Save Cache Commands.
   */
  generate(): SaveCacheCommandShape {
    return { save_cache: { ...this.parameters } };
  }
}

/**
 * Command parameters for the SaveCache command
 */
export interface SaveCacheParameters extends CommandParameters {
  /**
   * List of directories which should be added to the cache
   */
  paths: ListParameter;
  /**
   * Unique identifier for this cache
   */
  key: StringParameter;
  /**
   * Specify when to enable or disable the step.
   */
  when?: 'always' | 'on_success' | 'on_fail';
}
/**
 * JSON Schema for the SaveCache command.
 */
export interface SaveCacheCommandShape extends CommandShape {
  save_cache: SaveCacheParameters;
}
