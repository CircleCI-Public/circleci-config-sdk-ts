import {
  ListParameter,
  StringParameter,
} from '../../../../Parameters/types/Parameters.types';
import { CommandParameters, CommandShape } from '../../../types/Command.types';
import { Command } from '../../Command';
/**
 * Special step used to Persist the workflow’s workspace to the current container. The full contents of the workspace are downloaded and copied into the directory the workspace is being Persisted at.
 */
export class Persist extends Command {
  parameters: PersistParameters;
  constructor(parameters: PersistParameters) {
    super('persist_to_workspace');
    this.parameters = parameters;
  }
  /**
   * Generate Save.cache Command schema.
   * @returns The generated JSON for the Save.cache Commands.
   */
  generate(): PersistCommandShape {
    return {
      persist_to_workspace: { ...this.parameters },
    };
  }
}

/**
 * JSON Schema for the Persist command.
 */
export interface PersistCommandShape extends CommandShape {
  persist_to_workspace: PersistParameters;
}

/**
 * Command parameters for the Persist command
 */
export interface PersistParameters extends CommandParameters {
  /**
   * Either an absolute path or a path relative to `working_directory`
   */
  root: StringParameter;
  /**
   * Glob identifying file(s), or a non-glob path to a directory to add to the shared workspace. Interpreted as relative to the workspace root. Must not be the workspace root itself.
   */
  paths: ListParameter;
}