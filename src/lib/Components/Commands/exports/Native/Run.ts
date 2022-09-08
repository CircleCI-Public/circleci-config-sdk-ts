import { GenerableType } from '../../../../Config/exports/Mapping';
import { Executable } from '../../../Executors/types/ExecutorParameters.types';
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

  /**
   * Add an environment variable to the command.
   * This will be set in plain-text via the exported config file.
   * Consider using project-level environment variables or a context for sensitive information.
   * @see {@link https://circleci.com/docs/env-vars}
   * @example
   * ```
   * myCommand.addEnvVar('MY_VAR', 'my value');
   * ```
   */
  addEnvVar(name: string, value: string): this {
    if (!this.parameters.environment) {
      this.parameters.environment = {
        [name]: value,
      };
    } else {
      this.parameters.environment[name] = value;
    }
    return this;
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
export interface RunParameters extends CommandParameters, Executable {
  /**
   * Command to run via the shell
   */
  command: StringParameter;
  /**
   * Whether or not this step should run in the background (default: false)
   */
  background?: BooleanParameter;
  /**
   * Elapsed time the command can run without output. The string is a decimal with unit suffix, such as “20m”, “1.25h”, “5s” (default: 10 minutes)
   */
  no_output_timeout?: StringParameter;
  /**
   * Specify when to enable or disable the step. (default: on_success)
   */
  when?: 'always' | 'on_success' | 'on_fail';

  // Execution environment properties
  shell?: StringParameter;
  environment?: EnvironmentParameter;
  working_directory?: StringParameter;
}
