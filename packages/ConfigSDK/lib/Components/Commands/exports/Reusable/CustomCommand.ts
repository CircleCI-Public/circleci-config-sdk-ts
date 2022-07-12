import { Generable } from '../../..';
import { GenerableType } from '../../../../Config/exports/Mapping';
import { CustomParametersList } from '../../../Parameters';
import { Parameterized } from '../../../Parameters/exports/Parameterized';
import { CommandParameterLiteral } from '../../../Parameters/types/CustomParameterLiterals.types';
import { AnyCommandShape, CustomCommandShape } from '../../types/Command.types';
import { Command } from '../Command';

/**
 * Define a custom Command with custom parameters
 * {@label STATIC_2.1}
 */
export class CustomCommand
  implements Generable, Parameterized<CommandParameterLiteral>
{
  /**
   * Name used to reference this command definition from command steps.
   */
  name: string;
  /**
   * Steps this command will execute when called.
   */
  steps: Command[];
  /**
   * Custom list of parameters that can be used when calling this command.
   */
  parameters?: CustomParametersList<CommandParameterLiteral>;

  /**
   * A string that describes the purpose of the command
   */
  description?: string;

  constructor(
    name: string,
    steps?: Command[],
    parameters?: CustomParametersList<CommandParameterLiteral>,
    description?: string,
  ) {
    this.name = name;
    this.steps = steps || [];
    this.parameters = parameters;
    this.description = description;
  }

  generate(flatten?: boolean): CustomCommandShape {
    const generatedSteps: AnyCommandShape[] = this.steps.map((step) =>
      step.generate(flatten),
    );

    return {
      [this.name]: {
        parameters: this.parameters?.generate(),
        steps: generatedSteps,
        description: this.description,
      },
    };
  }

  addStep(step: Command): CustomCommand {
    this.steps.push(step);

    return this;
  }

  defineParameter(
    name: string,
    type: CommandParameterLiteral,
    defaultValue?: unknown,
    description?: string,
    enumValues?: string[],
  ): CustomCommand {
    if (!this.parameters) {
      this.parameters = new CustomParametersList<CommandParameterLiteral>();
    }

    this.parameters.define(name, type, defaultValue, description, enumValues);

    return this;
  }

  get generableType(): GenerableType {
    return GenerableType.CUSTOM_COMMAND;
  }
}
