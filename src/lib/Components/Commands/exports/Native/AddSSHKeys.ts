import { ListParameter } from '../../../Parameters/types/Parameters.types';
import { CommandParameters, CommandShape } from '../../types/Command.types';
import { Command } from '../Command';

/**
 * The AddSSHKeys command is a special step that adds SSH keys from a project’s settings to a container. Also configures SSH to use these keys.
 * @param parameters - AddSSHKeysParameters
 */
export class AddSSHKeys extends Command {
  parameters: AddSSHKeysParameters;
  constructor(parameters: AddSSHKeysParameters) {
    super('add_ssh_keys');
    this.parameters = parameters;
  }
  /**
   * Generate AddSSHKeys Command shape.
   * @returns The generated JSON for the AddSSHKeys Commands.
   */
  generate(): AddSSHKeysCommandShape {
    const command = { add_ssh_keys: {} };
    command.add_ssh_keys = { ...command.add_ssh_keys, ...this.parameters };
    return command as AddSSHKeysCommandShape;
  }
}

/**
 * Command parameters for the AddSSHKeys command
 */
export interface AddSSHKeysParameters extends CommandParameters {
  /**
   * List of fingerprints corresponding to the keys to be added.
   */
  fingerprints: ListParameter;
}

/**
 * JSON shape for the AddSSHKeys command.
 */
export interface AddSSHKeysCommandShape extends CommandShape {
  add_ssh_keys: AddSSHKeysParameters;
}
