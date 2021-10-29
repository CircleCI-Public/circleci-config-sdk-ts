import { CustomCommand } from '.';
import { ReusableCommandParameterType } from '../../Parameters/Parameters.types';
import { Command, CommandParameters, CommandSchema } from '../Command';

export class ReusableCommand extends Command {
  parameters?: CommandParameters<ReusableCommandParameterType>;

  constructor(
    command: CustomCommand,
    parameters?: CommandParameters<ReusableCommandParameterType>,
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
