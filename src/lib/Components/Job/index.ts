import { GenerableType } from '../../Config/exports/Mapping';
import { Command } from '../Commands/exports/Command';
import { Executable } from '../Executors/types/ExecutorParameters.types';
import { Generable } from '../index';
import { EnvironmentParameter, StringParameter } from '../Parameters/types';
import {
  AnyExecutor,
  JobContentsShape,
  JobExtraProperties,
  JobsShape,
} from './types/Job.types';

/**
 * Jobs define a collection of steps to be run within a given executor, and are orchestrated using Workflows.
 */
export class Job implements Generable, Executable {
  /**
   * The name of the current Job.
   */
  name: StringParameter;
  /**
   * The reusable executor to use for this job. The Executor must have already been instantiated and added to the config.
   */
  executor: AnyExecutor;
  /**
   * A list of Commands to execute within the job in the order which they were added.
   */
  steps: Command[];
  /**
   * Number of parallel instances of this job to run (default: 1)
   */
  parallelism;

  // Execution environment properties

  environment?: EnvironmentParameter;
  shell?: StringParameter;
  working_directory?: StringParameter;

  /**
   * Instantiate a CircleCI Job
   * @param name - Name your job with a unique identifier
   * @param executor - The reusable executor to use for this job. The Executor must have already been instantiated and added to the config.
   * @param steps - A list of Commands to execute within the job in the order which they were added.
   * @param properties - Optional extra properties like Parallelism, shell, working_directory or env
   * @see {@link https://circleci.com/docs/2.0/configuration-reference/?section=configuration#jobs}
   */
  constructor(
    name: string,
    executor: AnyExecutor,
    steps: Command[] = [],
    properties?: JobExtraProperties,
  ) {
    this.name = name;
    this.executor = executor;
    this.steps = steps;
    this.environment = properties?.environment;
    this.shell = properties?.shell;
    this.working_directory = properties?.working_directory;
    this.parallelism = properties?.parallelism;
  }

  /**
   * Generates the contents of the Job.
   * @returns The generated JSON for the Job's contents.
   */
  generateContents(flatten?: boolean): JobContentsShape {
    const generatedSteps = this.steps.map((step) => {
      return step.generate(flatten);
    });
    const generatedExecutor = this.executor.generate(flatten);

    return {
      ...generatedExecutor,
      steps: generatedSteps,
      environment: this.environment,
      shell: this.shell,
      working_directory: this.working_directory,
      parallelism: this.parallelism,
    };
  }
  /**
   * Generate Job schema
   * @returns The generated JSON for the Job.
   */
  generate(flatten?: boolean): JobsShape {
    return {
      [this.name]: this.generateContents(flatten),
    };
  }

  /**
   * Add steps to the current Job. Chainable.
   * @param command - Command to use for step
   */
  addStep(command: Command): this {
    this.steps.push(command);
    return this;
  }

  /**
   * Add an environment variable to the job.
   * This will be set in plain-text via the exported config file.
   * Consider using project-level environment variables or a context for sensitive information.
   * @see {@link https://circleci.com/docs/env-vars}
   * @example
   * ```
   * myJob.addEnvVar('MY_VAR', 'my value');
   * ```
   */
  addEnvVar(name: string, value: string): this {
    if (!this.environment) {
      this.environment = {
        [name]: value,
      };
    } else {
      this.environment[name] = value;
    }
    return this;
  }

  get generableType(): GenerableType {
    return GenerableType.JOB;
  }
}
