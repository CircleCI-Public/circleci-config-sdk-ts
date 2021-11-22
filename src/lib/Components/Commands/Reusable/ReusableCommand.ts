import { CustomCommand } from '.';
import { CommandParameterTypes } from '../../Parameters/types/ComponentParameters.types';
import { Command, CommandParameters, CommandSchema } from '../Command';

/**
 * Use a reusable command with parameters.
 *
 * {@label STATIC_2.1}
 */
export class ReusableCommand extends Command {
  parameters?: CommandParameters<CommandParameterTypes>;

  constructor(
    command: CustomCommand,
    parameters?: CommandParameters<CommandParameterTypes>,
  ) {
    super(command.name);
    this.parameters = parameters;
  }

  /**
   * @returns JSON representation of the reusable command being called
   */
  generate(): CommandSchema {
    return {
      [this.name]: { ...this.parameters },
    };
  }
}
