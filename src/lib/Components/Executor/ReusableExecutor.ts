import { Component } from '..';
import { CustomParametersList } from '../Parameters';
import { ParameterizedComponent } from '../Parameters/ParameterizedComponent';
import { PrimitiveParameterLiteral } from '../Parameters/Parameters.types';
import { AbstractExecutor } from './Executor';
import { ReusableExecutorSchema } from './ReusableExecutor.types';
/**
 * A 2.1 wrapper for reusing CircleCI executor.
 * @see {@link https://circleci.com/docs/2.0/reusing-config/#the-executors-key}
 */
export class ReusableExecutor
  extends Component
  implements ParameterizedComponent<PrimitiveParameterLiteral>
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
  parameters: CustomParametersList<PrimitiveParameterLiteral>;

  constructor(
    name: string,
    executor: AbstractExecutor,
    parameters?: CustomParametersList<PrimitiveParameterLiteral>,
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
    type: PrimitiveParameterLiteral,
    defaultValue?: unknown,
    description?: string,
    enumValues?: string[],
  ): Component {
    return this.parameters.define(
      name,
      type,
      defaultValue,
      description,
      enumValues,
    );
  }
}
