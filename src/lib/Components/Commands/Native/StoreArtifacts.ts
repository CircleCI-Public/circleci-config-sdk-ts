import { Command, CommandParameters, CommandSchema } from '../Command';

/**
 * A special step used to check out source code to the configured path (defaults to the working_directory).
 * @param parameters - StoreArtifactsParameters
 */
export class StoreArtifacts extends Command {
  parameters: StoreArtifactsParameters;
  constructor(parameters: StoreArtifactsParameters) {
    super('store_artifacts');
    this.parameters = parameters;
  }
  /**
   * Generate StoreArtifacts Command schema.
   * @returns The generated JSON for the StoreArtifacts Commands.
   */
  generate(): unknown {
    return {
      store_artifacts: { ...this.parameters },
    } as StoreArtifactsCommandSchema;
  }
}

export interface StoreArtifactsParameters extends CommandParameters {
  /**
   * Directory in the primary container to save as job artifacts
   */
  path: string;
  /**
   * Prefix added to the artifact paths in the artifacts API (default: the directory of the file specified in path)
   */
  destination?: string;
}

export interface StoreArtifactsCommandSchema extends CommandSchema {
  store_artifacts: StoreArtifactsParameters;
}
