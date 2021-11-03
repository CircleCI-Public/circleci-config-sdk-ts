import { Component } from '../..';
import { CustomParametersList, CustomParametersSchema } from '../../Parameters';
import { ParameterizedComponent } from '../../Parameters/ParameterizedComponent';
import { CommandParameterLiteral } from '../../Parameters/Parameters.types';
import { Command, CommandSchema } from '../Command';

type CustomCommandSchema = {
  [name: string]: {
    parameters: CustomParametersSchema;
    steps: CommandSchema[];
  };
};

/**
 * Define a custom Command with custom parameters
 */
export class CustomCommand
  extends Component
  implements ParameterizedComponent<CommandParameterLiteral>
{
  name: string;
  parameters: CustomParametersList<CommandParameterLiteral>;
  steps: Command[];

  constructor(
    name: string,
    parameters?: CustomParametersList<CommandParameterLiteral>,
    steps?: Command[],
  ) {
    super();
    this.name = name;
    this.parameters = parameters || new CustomParametersList();
    this.steps = steps || [];
  }

  generate(): CustomCommandSchema {
    const generatedSteps = this.steps.map((step) => step.generate());

    return {
      [this.name]: {
        parameters: this.parameters.generate(),
        steps: generatedSteps,
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
    this.parameters.define(name, type, defaultValue, description, enumValues);

    return this;
  }
}
