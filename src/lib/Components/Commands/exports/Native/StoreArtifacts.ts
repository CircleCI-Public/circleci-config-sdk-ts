import { StringParameter } from '../../../Parameters/types/Parameters.types';
import { CommandParameters, CommandShape } from '../../types/Command.types';
import { Command } from '../Command';

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
   * Generate StoreArtifacts Command shape.
   * @returns The generated JSON for the StoreArtifacts Commands.
   */
  generate(): StoreArtifactsCommandShape {
    return {
      store_artifacts: { ...this.parameters },
    };
  }
}
/**
 * Command parameters for the StoreArtifacts command
 */
export interface StoreArtifactsParameters extends CommandParameters {
  /**
   * Directory in the primary container to save as job artifacts
   */
  path: StringParameter;
  /**
   * Prefix added to the artifact paths in the artifacts API (default: the directory of the file specified in path)
   */
  destination?: StringParameter;
}

/**
 * Generated Shape of the StoreArtifacts command.
 */
export interface StoreArtifactsCommandShape extends CommandShape {
  store_artifacts: StoreArtifactsParameters;
}
