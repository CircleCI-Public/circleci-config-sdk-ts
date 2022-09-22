import { GenerableType } from '../../../Config/exports/Mapping';
import { ExecutorLiteral } from '../types/Executor.types';
import {
  MachineExecutorShape,
  MachineResourceClass,
} from '../types/MachineExecutor.types';
import { Executor } from './Executor';

/**
 * The Linux Virtual Machine Executor.
 * @see {@link https://circleci.com/docs/2.0/executor-types/#using-machine}
 */
export class MachineExecutor extends Executor<MachineResourceClass> {
  /**
   * Select one of the Ubuntu Linux VM Images provided by CircleCI.
   * @see - https://circleci.com/developer/machine
   */
  image = 'ubuntu-2004:202010-01';
  docker_layer_caching?: boolean;

  constructor(
    resource_class: MachineResourceClass = 'medium',
    image?: string,
    docker_layer_caching?: boolean,
  ) {
    super(resource_class);
    this.image = image || this.image;
    this.docker_layer_caching = docker_layer_caching;
  }

  generateContents(): MachineExecutorShape {
    return {
      image: this.image,
      docker_layer_caching: this.docker_layer_caching,
    };
  }

  get generableType(): GenerableType {
    return GenerableType.MACHINE_EXECUTOR;
  }

  get executorLiteral(): ExecutorLiteral {
    return 'machine';
  }

  /**
   * Enable docker image layer caching
   * @param {boolean} enabled - If true, docker layer caching is enabled for the machine executor.
   * @returns {MachineExecutor} - The current instance of the MachineExecutor Command.
   * @see {@link https://circleci.com/docs/2.0/docker-layer-caching/}
   */
  setDockerLayerCaching(enabled: boolean): MachineExecutor {
    this.docker_layer_caching = enabled;
    return this;
  }
}
