import { GenerableType } from '../../../Config/exports/Mapping';
import { ExecutorLiteral } from '../types/Executor.types';
import { ExecutableParameters } from '../types/ExecutorParameters.types';
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
  constructor(
    resource_class: MachineResourceClass = 'medium',
    image?: string,
    parameters?: ExecutableParameters,
  ) {
    super(resource_class, parameters);
    this.image = image || this.image;
  }
  generateContents(): MachineExecutorShape {
    return {
      image: this.image,
    };
  }

  get generableType(): GenerableType {
    return GenerableType.MACHINE_EXECUTOR;
  }

  get executorLiteral(): ExecutorLiteral {
    return 'machine';
  }
}
