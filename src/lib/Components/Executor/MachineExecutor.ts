import { AbstractExecutor } from '../../Components/Executor/Executor';
import {
  MachineExecutorSchema,
  MachineResourceClass,
} from './MachineExecutor.types';

/**
 * The Linux Virtual Machine Executor.
 * @see {@link https://circleci.com/docs/2.0/executor-types/#using-machine}
 */
export class MachineExecutor extends AbstractExecutor {
  /**
   * Select one of the Ubuntu Linux VM Images provided by CircleCI.
   * @see - https://circleci.com/developer/machine
   */
  image = 'ubuntu-2004:202010-01';
  resourceClass: MachineResourceClass;
  constructor(resourceClass: MachineResourceClass = 'medium', image?: string) {
    super(resourceClass);
    this.image = image || this.image;
    this.resourceClass = resourceClass;
  }
  generate(): MachineExecutorSchema {
    return {
      machine: {
        image: this.image,
      },
      resource_class: this.resourceClass,
    };
  }
}
