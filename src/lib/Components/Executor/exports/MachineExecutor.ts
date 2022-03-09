import { GenerableType } from '../../../Config/types/Config.types';
import { ExecutorParameters } from '../types/ExecutorParameters.types';
import {
  MachineExecutorShape,
  MachineResourceClass,
} from '../types/MachineExecutor.types';
import { Executor } from './Executor';

/**
 * The Linux Virtual Machine Executor.
 * @see {@link https://circleci.com/docs/2.0/executor-types/#using-machine}
 */
export class MachineExecutor extends Executor {
  /**
   * Select one of the Ubuntu Linux VM Images provided by CircleCI.
   * @see - https://circleci.com/developer/machine
   */
  image = 'ubuntu-2004:202010-01';
  resource_class: MachineResourceClass;
  constructor(
    resource_class: MachineResourceClass = 'medium',
    image?: string,
    parameters?: ExecutorParameters,
  ) {
    super(resource_class, parameters);
    this.image = image || this.image;
    this.resource_class = resource_class;
  }
  generate(): MachineExecutorShape {
    return {
      machine: {
        image: this.image,
      },
      resource_class: this.resource_class,
    };
  }

  get generableType(): GenerableType {
    return GenerableType.MACHINE_EXECUTOR;
  }
}
