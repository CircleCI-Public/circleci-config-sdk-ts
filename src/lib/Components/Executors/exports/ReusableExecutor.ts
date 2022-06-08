import { GenerableType } from '../../../Config/exports/Mapping';
import { CustomParametersList } from '../../Parameters';
import { Parameterized } from '../../Parameters/exports/Parameterized';
import { ExecutorParameterLiteral } from '../../Parameters/types/CustomParameterLiterals.types';
import { ExecutableShape } from '../types/Executor.types';
import {
  ReusableExecutorContents,
  ReusableExecutorJobRefShape,
  ReusableExecutorShape,
} from '../types/ReusableExecutor.types';
import { Executable } from './Executable';
import { Executor } from './Executor';
/**
 * A 2.1 wrapper for reusing CircleCI executor.
 * @see {@link https://circleci.com/docs/2.0/reusing-config/#the-executors-key}
 * {@label STATIC_2.1}
 */
export class ReusableExecutor
  extends Executable
  implements Parameterized<ExecutorParameterLiteral>
{
  /**
   * Parameters to assign to the executor
   */
  parameters?: CustomParametersList<ExecutorParameterLiteral>;

  constructor(
    name: string,
    executor: Executor,
    parameters?: CustomParametersList<ExecutorParameterLiteral>,
  ) {
    super(name, executor);
    this.parameters = parameters;
  }
  /**
   * Generate Reusable Executor schema.
   * @returns The generated JSON for the Reusable Executor.
   */
  generateContents(): ReusableExecutorContents {
    return {
      ...super.generateContents(),
      parameters: this.parameters?.generate(),
    };
  }

  generate(
    ctx?: GenerableType,
  ): ReusableExecutorJobRefShape | ReusableExecutorShape {
    if (ctx == GenerableType.JOB) {
      return {
        executor: {
          name: this.name,
        },
      };
    }

    // We know this type since this.generateContents determines the generic type of the super.generate function
    return super.generate() as ExecutableShape<ReusableExecutorContents>;
  }

  defineParameter(
    name: string,
    type: ExecutorParameterLiteral,
    defaultValue?: unknown,
    description?: string,
    enumValues?: string[],
  ): ReusableExecutor {
    if (!this.parameters) {
      this.parameters = new CustomParametersList<ExecutorParameterLiteral>();
    }

    this.parameters.define(name, type, defaultValue, description, enumValues);

    return this;
  }

  get generableType(): GenerableType {
    return GenerableType.REUSABLE_EXECUTOR;
  }
}
