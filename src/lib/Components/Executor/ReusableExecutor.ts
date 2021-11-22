import { Component } from '..';
import { CustomParametersList } from '../Parameters';
import { ParameterizedComponent } from '../Parameters/exports/ParameterizedComponent';
import { ExecutorParameterLiteral } from '../Parameters/types/CustomParameterLiterals.types';
import { AbstractExecutor } from './Executor';
import { ReusableExecutorSchema } from './ReusableExecutor.types';
/**
 * A 2.1 wrapper for reusing CircleCI executor.
 * @see {@link https://circleci.com/docs/2.0/reusing-config/#the-executors-key}
 * {@label STATIC_2.1}
 */
export class ReusableExecutor
  extends Component
  implements ParameterizedComponent<ExecutorParameterLiteral>
{
  /**
   * The name of a defined executor to use.
   */
  name: string;

  /**
   * The referenced executor to use.
   */
  executor: AbstractExecutor;

  /**
   * Parameters to assign to the executor
   */
  parameters: CustomParametersList<ExecutorParameterLiteral>;

  constructor(
    name: string,
    executor: AbstractExecutor,
    parameters?: CustomParametersList<ExecutorParameterLiteral>,
  ) {
    super();
    this.name = name;
    this.executor = executor;
    this.parameters = parameters || new CustomParametersList();
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

  defineParameter(
    name: string,
    type: ExecutorParameterLiteral,
    defaultValue?: unknown,
    description?: string,
    enumValues?: string[],
  ): ReusableExecutor {
    this.parameters.define(name, type, defaultValue, description, enumValues);

    return this;
  }
}
