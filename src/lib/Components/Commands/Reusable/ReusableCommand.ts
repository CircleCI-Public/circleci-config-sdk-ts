import { CustomCommand } from '.';
import { PrimitiveParameterTypes } from '../../Parameters/Parameters.types';
import { Command, CommandParameters, CommandSchema } from '../Command';

export class ReusableCommand extends Command {
  parameters?: CommandParameters<PrimitiveParameterTypes>;

  constructor(
    command: CustomCommand,
    parameters?: CommandParameters<PrimitiveParameterTypes>,
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
