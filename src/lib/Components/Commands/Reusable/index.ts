import { Component } from '../..';
import { CustomParametersList } from '../../Parameters';
import { PrimitiveParameter } from '../../Parameters/Parameters.types';
import { Command } from '../Command';

/**
 * Define a custom command with custom parameer
 */
export class CustomCommand extends Component {
  name: string;
  parameters: CustomParametersList<PrimitiveParameter>;
  steps: Command[];

  constructor(
    name: string,
    parameters?: CustomParametersList<PrimitiveParameter>,
    steps?: Command[],
  ) {
    super();
    this.name = name;
    this.parameters = parameters || new CustomParametersList();
    this.steps = steps || [];
  }

  generate(): unknown {
    const generatedSteps = this.steps.map((step) => {
      return step.generate();
    });

    return {
      [this.name]: {
        parameters: this.parameters.generate(),
        steps: generatedSteps,
      },
    };
  }
}
