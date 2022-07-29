import { GenerableType } from '../../../../Config/exports/Mapping';
import { OrbRef } from '../../../../Orb';
import { StringParameter } from '../../../Parameters/types';
import { CommandParameterLiteral } from '../../../Parameters/types/CustomParameterLiterals.types';
import { CommandParameters, CommandShape } from '../../types/Command.types';
import { Command } from '../Command';
import { ReusableCommand } from './ReusableCommand';

/**
 * Use a reusable command with parameters.
 *
 * {@label STATIC_2.1}
 */
export class ReusedCommand implements Command {
  parameters?: CommandParameters;
  name: StringParameter;

  /**
   * Reuse user defined functionality by adding a reusable command to a job.
   * @param command - A custom command to be reused.
   * @param parameters - the parameters to be passed to the custom command.
   */
  constructor(
    command: ReusableCommand | string | OrbRef<CommandParameterLiteral>,
    parameters?: CommandParameters,
  ) {
    this.name = typeof command === 'string' ? command : command.name;
    this.parameters = parameters;

    //TODO: Parse that CommandParameters parameters do exist on ReusableCommand
  }

  /**
   * @returns JSON representation of the reusable command being called
   */
  generate(): CommandShape {
    return {
      [this.name]: { ...this.parameters },
    };
  }

  get generableType(): GenerableType {
    return GenerableType.REUSABLE_COMMAND;
  }
}
