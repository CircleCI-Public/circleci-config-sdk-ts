import { GenerableType } from '../../../../../../Config/exports/Mapping';
import { StringParameter } from '../../../../../Parameters/types';
import {
  CommandShape,
  CommandShorthandShape,
} from '../../../../types/Command.types';
import { Command } from '../../../Command';
import { RunParameters } from './RunParameters';

/**
 * The Run step is used for invoking all command-line programs.
 * @see {@link https://circleci.com/docs/configuration-reference#run}
 */
export class Run implements Command {
  parameters: RunParameters;
  constructor(parameters: RunParameters) {
    this.parameters = parameters;
  }
  /**
   * Generate Run Command shape.*
   * @returns The generated JSON for the Run Command.
   */
  generate(flatten = false): RunCommandShape | RunCommandShorthandShape {
    const { command, ...parameters } = this.parameters;

    if (Object.keys(parameters).length === 0 && flatten) {
      return { run: command } as RunCommandShorthandShape;
    }

    return { run: this.parameters } as RunCommandShape;
  }

  get name(): StringParameter {
    return 'run';
  }

  get generableType(): GenerableType {
    return GenerableType.RUN;
  }
}

/**
 * Run Command Shape
 */
interface RunCommandShape extends CommandShape {
  run: RunParameters;
}

interface RunCommandShorthandShape extends CommandShorthandShape {
  run: string;
}
