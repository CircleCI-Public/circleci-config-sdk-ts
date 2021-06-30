import { Command, CommandParameters, CommandSchema } from '../Command';

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
   * @returns The generated JSON for the SetupRemoteDocker Command.
   */
  generate(): SetupRemoteDockerCommandSchema {
    return {
      setup_remote_docker: { ...this.parameters },
    } as SetupRemoteDockerCommandSchema;
  }
}
export default SetupRemoteDocker;
export interface SetupRemoteDockerParameters extends CommandParameters {
  /**
   * SetupRemoteDocker directory.
   * Will be interpreted relative to the working_directory of the job.
   */
  version: string;
}

export interface SetupRemoteDockerCommandSchema extends CommandSchema {
  setup_remote_docker: SetupRemoteDockerParameters;
}
