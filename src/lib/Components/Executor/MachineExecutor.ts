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
  image = 'ubuntu-2004:202010-01';
  resourceClass: MachineResourceClass;
  constructor(
    name: string,
    resourceClass: MachineResourceClass = 'medium',
    image?: string,
  ) {
    super(name, resourceClass);
    this.image = image || this.image;
    this.resourceClass = resourceClass;
  }
  generate(): MachineExecutorSchema {
    return {
      [this.name]: {
        machine: {
          image: this.image,
        },
        resource_class: this.resourceClass,
      },
    };
  }
}
