import { Config } from '../../../Config';
import { ValidationResult } from '../../../Config/ConfigValidator';
import MachineExecutorSchema from '../schemas/MachineExecutor.schema';
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
  constructor(resourceClass: MachineResourceClass = 'medium', image?: string) {
    super(resourceClass);
    this.image = image || this.image;
    this.resource_class = resourceClass;
  }
  generate(): MachineExecutorShape {
    return {
      machine: {
        image: this.image,
      },
      resource_class: this.resource_class,
    };
  }

  static validate(input: unknown): ValidationResult {
    return Config.validator.validateData(MachineExecutorSchema, input);
  }
}