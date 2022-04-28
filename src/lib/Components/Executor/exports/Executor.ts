import { GenerableType } from '../../../Config/types/Config.types';
import { Generable } from '../../index';
import { DockerResourceClass } from '../types/DockerExecutor.types';
import { ExecutorShape } from '../types/Executor.types';
import { ExecutorParameters } from '../types/ExecutorParameters.types';

/**
 * A generic reusable Executor
 */
export abstract class Executor implements Generable {
  resource_class: string;
  parameters?: ExecutorParameters;

  constructor(
    resource_class: DockerResourceClass,
    parameters?: ExecutorParameters,
  ) {
    this.resource_class = resource_class;
    this.parameters = parameters;
  }
  abstract generate(): ExecutorShape;
  abstract get generableType(): GenerableType;
}
