import { Command, CommandParameters, CommandSchema } from '../Command';

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
   * Generate AddSSHKeys Command schema.
   * @returns The generated JSON for the AddSSHKeys Commands.
   */
  generate(): AddSSHKeysCommandSchema {
    const command = { add_ssh_keys: {} };
    command.add_ssh_keys = { ...command.add_ssh_keys, ...this.parameters };
    return command as AddSSHKeysCommandSchema;
  }
}

/**
 * Command parameters for the AddSSHKeys command
 */
export interface AddSSHKeysParameters extends CommandParameters {
  /**
   * List of fingerprints corresponding to the keys to be added.
   */
  fingerprints: string[];
}

/**
 * JSON Schema for the AddSSHKeys command.
 */
export interface AddSSHKeysCommandSchema extends CommandSchema {
  add_ssh_keys: AddSSHKeysParameters;
}
