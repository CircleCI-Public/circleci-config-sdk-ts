import { Command } from '../Commands/exports/Command';
import { Executor } from '../Executor/exports/Executor';
import { ExecutorShape as ExecutorShape } from '../Executor/types/Executor.types';
import { ReusableExecutor } from '../Executor/exports/ReusableExecutor';
import { Component } from '../index';
import { JobContentShape, JobShape } from './types/Job.types';

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
  executor: Executor | ReusableExecutor;
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
  constructor(
    name: string,
    executor: Executor | ReusableExecutor,
    steps?: Command[],
  ) {
    super();
    this.name = name;
    this.executor = executor;
    this.steps = steps || [];
  }

  /**
   * Generates the contents of the Job.
   * @returns The generated JSON for the Job's contents.
   */
  generateJobContents(): JobContentShape {
    const generatedSteps = this.steps.map((step) => {
      return step.generate();
    });
    const generatedExecutor = this.executor.generate() as ExecutorShape;

    return { steps: generatedSteps, ...generatedExecutor };
  }
  /**
   * Generate Job schema
   * @returns The generated JSON for the Job.
   */
  generate(): JobShape {
    return {
      [this.name]: this.generateJobContents(),
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
