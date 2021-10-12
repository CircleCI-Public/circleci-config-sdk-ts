import { Command, CommandParameters, CommandSchema } from '../Command';

/**
 * The Run command step is used for invoking all command-line programs.
 * @param parameters - RunParameters
 */
export class Run extends Command {
  parameters: RunParameters;
  constructor(parameters: RunParameters) {
    super('run');
    this.parameters = parameters;
  }
  /**
   * Generate Run Command schema.
   * @returns The generated JSON for the Run Commands.
   */
  generate(): unknown {
    const command = { run: {} };
    command.run = { ...command.run, ...this.parameters };
    return command as RunCommandSchema;
  }
}
export interface RunParameters extends CommandParameters {
  /**
   * Command to run via the shell
   */
  command: string;
  /**
   * Shell to use for execution command (default: See Default Shell Options)
   */
  shell?: string;
  /**
   * Additional environmental variables, locally scoped to command
   */
  environment?: Map<string, string>;
  /**
   * Whether or not this step should run in the background (default: false)
   */
  background?: boolean;
  /**
   * In which directory to run this step. Will be interpreted relative to the working_directory of the job). (default: .)
   */
  workingDirectory?: string;
  /**
   * Elapsed time the command can run without output. The string is a decimal with unit suffix, such as “20m”, “1.25h”, “5s” (default: 10 minutes)
   */
  noOutputTimeout?: string;
  /**
   * Specify when to enable or disable the step. (default: on_success)
   */
  when?: 'always' | 'on_success' | 'on_fail';
}

export interface RunCommandSchema extends CommandSchema {
  run: RunParameters;
}
