import { Command, CommandParameters, CommandSchema } from '../../Command';
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
  generate(): unknown {
    return {
      persist_to_workspace: { ...this.parameters },
    } as PersistCommandSchema;
  }
}
export interface PersistCommandSchema extends CommandSchema {
  persist_to_workspace: PersistParameters;
}
export interface PersistParameters extends CommandParameters {
  /**
   * Either an absolute path or a path relative to `working_directory`
   */
  root: string;
  /**
   * Glob identifying file(s), or a non-glob path to a directory to add to the shared workspace. Interpreted as relative to the workspace root. Must not be the workspace root itself.
   */
  paths: string[];
}
