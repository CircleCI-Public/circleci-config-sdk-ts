import Executor from '../../Components/Executor/Executor';
import {
  MachineExecutorSchema,
  MachineResourceClass,
} from './MachineExecutor.types';
export class MachineExecutor extends Executor {
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
