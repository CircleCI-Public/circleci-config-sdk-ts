import { Generable } from '../..';
import { GenerableType } from '../../../Config/exports/Mapping';
import { AnyExecutor } from '../../Job/types/Job.types';
import {
  ExecutableContentsShape,
  ExecutableShape,
} from '../types/Executor.types';

export abstract class Executable implements Generable {
  /**
   * The name of the current executable.
   */
  name: string;
  /**
   * The internal or reusable executor to use for this executable.
   */
  executor: AnyExecutor;

  /**
   * Instantiate a CircleCI Job
   * @param name - Name your job with a unique identifier
   * @param executor - The reusable executor to use for this job. The Executor must have already been instantiated and added to the config.
   * @param steps - A list of Commands to execute within the job in the order which they were added.
   * @see {@link https://circleci.com/docs/2.0/configuration-reference/?section=configuration#jobs}
   */
  constructor(name: string, executor: AnyExecutor) {
    this.name = name;
    this.executor = executor;
  }

  /**
   * Generates the contents of the Job.
   * @returns The generated JSON for the Job's contents.
   */
  generateContents(): ExecutableContentsShape {
    const generatedExecutor = this.executor.generate(
      this.generableType,
    ) as ExecutableContentsShape;

    return generatedExecutor;
  }
  /**
   * Generate Job schema
   * @returns The generated JSON for the Job.
   */
  generate(): ExecutableShape | unknown {
    return {
      [this.name]: this.generateContents(),
    };
  }

  abstract get generableType(): GenerableType;
}
