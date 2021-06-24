import Executor from '../../Components/Executor/Executor';
import { MachineExecutorSchema } from './MachineExecutor.types';

export class MachineExecutor extends Executor {
  image = 'ubuntu-2004:202010-01';
  constructor(name: string, image?: string) {
    super(name);
    this.image = image || this.image;
  }
  generate(): MachineExecutorSchema {
    return {
      [this.name]: {
        machine: {
          image: this.image,
        },
      },
    };
  }
}
