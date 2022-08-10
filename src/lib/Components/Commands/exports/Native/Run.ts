import { GenerableType } from '../../../../Config/exports/Mapping';
import {
  StringParameter,
  EnvironmentParameter,
  BooleanParameter,
} from '../../../Parameters/types';
import {
  CommandShape,
  CommandShorthandShape,
  CommandParameters,
} from '../../types/Command.types';
import { Command } from '../Command';

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

/**
 * Command parameters for the Run command
 */
export interface RunParameters extends CommandParameters {
  /**
   * Command to run via the shell
   */
  command: StringParameter;
  /**
   * Shell to use for execution command (default: See Default Shell Options)
   */
  shell?: StringParameter;
  /**
   * Additional environmental variables, locally scoped to command
   */
  environment?: EnvironmentParameter;
  /**
   * Whether or not this step should run in the background (default: false)
   */
  background?: BooleanParameter;
  /**
   * In which directory to run this step. Will be interpreted relative to the working_directory of the job). (default: .)
   */
  working_directory?: StringParameter;
  /**
   * Elapsed time the command can run without output. The string is a decimal with unit suffix, such as “20m”, “1.25h”, “5s” (default: 10 minutes)
   */
  no_output_timeout?: StringParameter;
  /**
   * Specify when to enable or disable the step. (default: on_success)
   */
  when?: 'always' | 'on_success' | 'on_fail';
}
