import { GenerableType } from '../../../Config/exports/Mapping';
import { Generable } from '../../index';
import { AnyResourceClass, ExecutorShape } from '../types/Executor.types';
import { ExecutableParameters } from '../types/ExecutorParameters.types';

/**
 * A generic reusable Executor
 */
export abstract class Executor<
  ResourceClass extends AnyResourceClass = AnyResourceClass,
> implements Generable
{
  resource_class: ResourceClass;
  parameters?: ExecutableParameters;

  /**
   * @param resource_class - The resource class of the environment
   * @param parameters - Optional parameters to describe the executable environment
   */
  constructor(
    resource_class: ResourceClass,
    parameters?: Exclude<ExecutableParameters, 'resource_class'>,
  ) {
    this.resource_class = resource_class;
    this.parameters = parameters;
  }
  abstract generate(ctx?: GenerableType): ExecutorShape;
  abstract get generableType(): GenerableType;
}
