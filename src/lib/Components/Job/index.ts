import { GenerableType } from '../../Config/exports/Mapping';
import { Command } from '../Commands/exports/Command';
import { ExecutorShape } from '../Executors/types/Executor.types';
import { Generable } from '../index';
import { ParameterizedJob } from './exports/ParameterizedJob';
import { AnyExecutor, JobContentsShape, JobsShape } from './types/Job.types';

/**
 * Jobs define a collection of steps to be run within a given executor, and are orchestrated using Workflows.
 */
export class Job implements Generable {
  /**
   * The name of the current Job.
   */
  name: string;
  /**
   * The reusable executor to use for this job. The Executor must have already been instantiated and added to the config.
   */
  executor: AnyExecutor;
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
  constructor(name: string, executor: AnyExecutor, steps?: Command[]) {
    this.name = name;
    this.executor = executor;
    this.steps = steps || [];
  }

  /**
   * Generates the contents of the Job.
   * @returns The generated JSON for the Job's contents.
   */
  generateContents(): JobContentsShape {
    const generatedSteps = this.steps.map((step) => {
      return step.generate();
    });
    const generatedExecutor = this.executor.generate(
      GenerableType.JOB,
    ) as ExecutorShape;

    return { steps: generatedSteps, ...generatedExecutor };
  }
  /**
   * Generate Job schema
   * @returns The generated JSON for the Job.
   */
  generate(): JobsShape {
    return {
      [this.name]: this.generateContents(),
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

  get generableType(): GenerableType {
    return GenerableType.JOB;
  }
}

export type UnknownJobShape = {
  [key: string]: unknown;
  steps: { [key: string]: unknown }[];
  resource_class: string;
  parameters?: { [key: string]: unknown };
};

export { ParameterizedJob };
