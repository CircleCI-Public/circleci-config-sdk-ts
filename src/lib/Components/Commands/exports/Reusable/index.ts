import { commands, parameters } from '../../../../..';
import {
  GenerableType,
  ParameterizedComponent,
} from '../../../../Config/exports/Mapping';
import { Validator } from '../../../../Config/exports/Validator';
import { CustomParametersList } from '../../../Parameters';
import { CommandParameterLiteral } from '../../../Parameters/types/CustomParameterLiterals.types';
import { StringParameter } from '../../../Parameters/types';
import {
  CommandParameters,
  CommandShape,
  CustomCommandBodyShape,
} from '../../types/Command.types';
import { Command } from '../Command';
import { CustomCommand } from './CustomCommand';

/**
 * Use a reusable command with parameters.
 *
 * {@label STATIC_2.1}
 */
export class ReusableCommand implements Command {
  parameters?: CommandParameters;
  name: StringParameter;

  /**
   * Reuse user defined functionality by adding a reusable command to a job.
   * @param command - A custom command to be reused.
   * @param parameters - the parameters to be passed to the custom command.
   */
  constructor(command: CustomCommand, parameters?: CommandParameters) {
    this.name = command.name;
    this.parameters = parameters;

    //TODO: Parse that CommandParameters parameters do exist on CustomCommand
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

// TODO: Handle circular references
export function parseCustomCommands(
  commandListIn: { [key: string]: unknown },
  custom_commands?: CustomCommand[],
): CustomCommand[] {
  return Object.entries(commandListIn).map(([name, args]) =>
    parseCustomCommand(name, args, custom_commands),
  );
}

export function parseCustomCommand(
  name: string,
  args: unknown,
  custom_commands?: CustomCommand[],
): CustomCommand {
  if (Validator.validateGenerable(GenerableType.CUSTOM_COMMAND, args)) {
    const command_args = args as CustomCommandBodyShape;

    const parametersList =
      command_args.parameters &&
      (parameters.parseList(
        command_args.parameters,
        ParameterizedComponent.COMMAND,
      ) as CustomParametersList<CommandParameterLiteral>);

    const steps = commands.parseSteps(command_args.steps, custom_commands);

    return new CustomCommand(
      name,
      steps,
      parametersList,
      command_args.description,
    );
  }

  throw new Error(`Failed to parse custom command.`);
}

export { CustomCommand };
