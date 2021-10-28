import { AbstractExecutor } from './Executor';
import { ReusableExecutorSchema } from './ReusableExecutor.types';
/**
 * A 2.1 wrapper for reusing CircleCI executor.
 * @see {@link https://circleci.com/docs/2.0/reusing-config/#the-executors-key}
 */
export class ReusableExecutor {
  /**
   * The name of a defined executor to use.
   */
  name: string;

  /**
   * The referenced executor to use.
   */
  executor: AbstractExecutor;

  constructor(name: string, executor: AbstractExecutor) {
    this.name = name;
    this.executor = executor;
  }
  /**
   * Generate Reusable Executor schema.
   * @returns The generated JSON for the Reusable Executor.
   */
  generate(): ReusableExecutorSchema {
    return {
      executor: {
        name: this.name,
      },
    };
  }
}
