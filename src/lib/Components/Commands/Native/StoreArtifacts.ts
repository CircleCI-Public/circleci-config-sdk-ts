import { Command, CommandParameters } from '../index.types';

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
   * @returns The generated JSON for the StoreArtifacts Command.
   */
  generate(): StoreArtifactsCommandSchema {
    return {
      store_artifacts: { ...this.parameters },
    } as StoreArtifactsCommandSchema;
  }
}
export default StoreArtifacts;
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

export interface StoreArtifactsCommandSchema {
  store_artifacts: StoreArtifactsParameters;
}