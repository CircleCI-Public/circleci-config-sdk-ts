import { Generable } from '../..';
import { GenerableType } from '../../../Config/exports/Mapping';
import { ExecutorParameterTypes } from '../../Parameters/types/ComponentParameters.types';
import {
  ReusedExecutorShape,
  ReusedExecutorShapeContents,
} from '../types/ReusableExecutor.types';
import { ReusableExecutor } from './ReusableExecutor';
/**
 * A 2.1 wrapper for reusing CircleCI executor.
 * @see {@link https://circleci.com/docs/2.0/reusing-config/#the-executors-key}
 * {@label STATIC_2.1}
 */
export class ReusedExecutor implements Generable {
  /**
   * The referenced executor to use.
   */
  private _executor: ReusableExecutor;

  /**
   * Parameters to assign to the executor
   */
  private _parameters?: Record<string, ExecutorParameterTypes>;

  constructor(
    executor: ReusableExecutor,
    parameters?: Record<string, ExecutorParameterTypes>,
  ) {
    this._executor = executor;
    this._parameters = parameters;
  }
  /**
   * Generate Reused Executor schema.
   * @returns The generated JSON for the Reused Executor.
   */
  generate(): ReusedExecutorShape {
    return {
      executor: this.generateContents(),
    };
  }
  /**
   * Generate Reused Executor schema.
   * @returns The generated JSON for the Reused Executor.
   */
  generateContents(): ReusedExecutorShapeContents {
    if (this._parameters) {
      return {
        name: this._executor.name,
        ...this._parameters,
      };
    }

    return this._executor.name;
  }

  get generableType(): GenerableType {
    return GenerableType.REUSED_EXECUTOR;
  }

  get executor(): ReusableExecutor {
    return this._executor;
  }

  get parameters(): Record<string, ExecutorParameterTypes> | undefined {
    return this._parameters;
  }
}
