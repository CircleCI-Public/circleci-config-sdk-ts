import { StringParameter } from '../../../Parameters/types/Parameters.types';
import { CommandParameters, CommandShape } from '../../types/Command.types';
import { Command } from '../Command';

/**
 * Creates a remote Docker environment configured to execute Docker commands.
 * @see {@link https://circleci.com/docs/2.0/configuration-reference/#setupremotedocker}
 * @param parameters - SetupRemoteDockerParameters
 */
export class SetupRemoteDocker extends Command {
  parameters: SetupRemoteDockerParameters;
  constructor(
    parameters: SetupRemoteDockerParameters = { version: '20.10.6' },
  ) {
    super('setup_remote_docker');
    this.parameters = parameters;
  }
  /**
   * Generate SetupRemoteDocker Command schema.
   * @returns The generated JSON for the SetupRemoteDocker Commands.
   */
  generate(): SetupRemoteDockerCommandShape {
    return {
      setup_remote_docker: { ...this.parameters },
    };
  }
}

/**
 * Command parameters for the SetupRemoteDocker command
 */
export interface SetupRemoteDockerParameters extends CommandParameters {
  /**
   * SetupRemoteDocker directory.
   * Will be interpreted relative to the working_directory of the job.
   */
  version: StringParameter;
}

/**
 * JSON Schema for the SetupRemoteDocker command.
 */
export interface SetupRemoteDockerCommandShape extends CommandShape {
  setup_remote_docker: SetupRemoteDockerParameters;
}
