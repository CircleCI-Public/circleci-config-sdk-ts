import { GenerableType } from '../../../Config/exports/Mapping';
import { Generable } from '../../index';
import { CustomParametersList } from '../../Parameters';
import { ExecutorParameterLiteral } from '../../Parameters/types/CustomParameterLiterals.types';
import {
  AnyResourceClass,
  ExecutorLiteral,
  ExecutorShape,
} from '../types/Executor.types';
import { ExecutableParameters } from '../types/ExecutorParameters.types';
import { ReusableExecutor } from './ReusableExecutor';

/**
 * A generic reusable Executor.
 */
export abstract class Executor<
  ResourceClass extends AnyResourceClass = AnyResourceClass,
> implements Generable
{
  resource_class: ResourceClass;
  parameters: ExecutableParameters;

  /**
   * @param resource_class - The resource class of the environment
   * @param parameters - Optional parameters to describe the executable environment
   */
  constructor(
    resource_class: ResourceClass,
    parameters?: Exclude<ExecutableParameters, 'resource_class'>,
  ) {
    this.resource_class = resource_class;
    this.parameters = parameters || {};
  }
  abstract get generableType(): GenerableType;
  abstract get executorLiteral(): ExecutorLiteral;
  abstract generateContents(): unknown;
  get generateResourceClass(): ResourceClass | string {
    return this.resource_class;
  }

  generate(): ExecutorShape {
    return {
      [this.executorLiteral]: this.generateContents(),
      resource_class: this.generateResourceClass,
      ...this.parameters,
    };
  }

  toReusable(
    name: string,
    parameters?: CustomParametersList<ExecutorParameterLiteral>,
  ): ReusableExecutor {
    return new ReusableExecutor(name, this, parameters);
  }

  /**
   * Add an environment variable to the Executor.
   * This will be set in plain-text via the exported config file.
   * Consider using project-level environment variables or a context for sensitive information.
   * @see {@link https://circleci.com/docs/env-vars}
   * @example
   * ```
   * myExecutor.addEnvVar('MY_VAR', 'my value');
   * ```
   */
  addEnvVar(name: string, value: string): this {
    if (!this.parameters.environment) {
      this.parameters.environment = {
        [name]: value,
      };
    } else {
      this.parameters.environment[name] = value;
    }
    return this;
  }
}
