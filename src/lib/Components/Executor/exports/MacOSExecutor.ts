import { ValidatorResult } from 'jsonschema';
import { Executor } from './Executor';
import { Config } from '../../../Config';
import { macOSExecutorSchema } from '../schemas/Executor.schema';
import {
  MacOSExecutorShape,
  MacOSResourceClass,
} from '../types/MacOSExecutor.types';

/**
 * A MacOS Virtual Machine with configurable Xcode version.
 * @see {@link https://circleci.com/docs/2.0/executor-types/#using-macos}
 */
export class MacOSExecutor extends Executor {
  resource_class: MacOSResourceClass;
  /**
   * Select an xcode version
   * @see {@link https://circleci.com/developer/machine/image/macos}
   */
  xcode: string;
  constructor(xcode: string, resourceClass: MacOSResourceClass = 'medium') {
    super(resourceClass);
    this.xcode = xcode;
    this.resource_class = resourceClass;
  }
  generate(): MacOSExecutorShape {
    return {
      macos: {
        xcode: this.xcode,
      },
      resource_class: this.resource_class,
    };
  }

  static validate(input: unknown): ValidatorResult {
    return Config.validator.validate(input, macOSExecutorSchema);
  }
}
