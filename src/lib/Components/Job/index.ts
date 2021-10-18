import { Command } from '../Commands/Command';
import { AbstractExecutor } from '../Executor/Executor';
import { ExecutorSchema } from '../Executor/Executor.types';
import { Component } from '../index';

/**
 * Jobs define a collection of steps to be run within a given executor, and are orchestrated using Workflows.
 */
export class Job extends Component {
  /**
   * The name of the current Job.
   */
  name: string;
  /**
   * The reusable executor to use for this job. The Executor must have already been instantiated and added to the config.
   */
  executor: AbstractExecutor;
  /**
   * A list of Commands to execute within the job in the order which they were added.
   */
  steps: Command[] = [];
  /**
   * Instantiate a CircleCI Job
   * @param name - Name your job with a unique identifier
   * @param executor - The reusable executor to use for this job. The Executor must have already been instantiated and added to the config.
   * @param steps - A list of Commands to execute within the job in the order which they were added.
   * @see {@link https://circleci.com/docs/2.0/configuration-reference/?section=configuration#jobs}
   */
  constructor(name: string, executor: AbstractExecutor, steps?: Command[]) {
    super();
    this.name = name;
    this.executor = executor;
    this.steps = steps || [];
  }
  /**
   * Generate Job schema
   * @returns The generated JSON for the Job.
   */
  generate(): unknown {
    const generatedSteps = this.steps.map((step) => {
      return step.generate();
    });
    const generatedExecutor = this.executor.generate() as ExecutorSchema;
    const jobContents: JobContentSchema = {
      steps: generatedSteps,
      ...generatedExecutor,
    };
    return {
      [this.name]: jobContents,
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
}

export interface JobStepsSchema {
  steps: unknown[]; // CommandSchemas for any command.
}

export type JobContentSchema = JobStepsSchema & ExecutorSchema;
export interface JobSchema {
  [key: string]: JobContentSchema;
}
