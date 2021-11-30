import { Executor } from './Executor';
import { Config } from '../../../Config';
import {
  MacOSExecutorShape,
  MacOSResourceClass,
} from '../types/MacOSExecutor.types';
import { ValidationResult } from '../../../Config/ConfigValidator';
import MacOSExecutorSchema from '../schemas/MacosExecutor.schema';
import { ExecutorParameters } from '../types/ExecutorParameters.types';

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
  constructor(
    xcode: string,
    resource_class: MacOSResourceClass = 'medium',
    parameters?: ExecutorParameters,
  ) {
    super(resource_class, parameters);
    this.xcode = xcode;
    this.resource_class = resource_class;
  }
  generate(): MacOSExecutorShape {
    return {
      macos: {
        xcode: this.xcode,
      },
      resource_class: this.resource_class,
    };
  }

  static validate(input: unknown): ValidationResult {
    return Config.validator.validateData(MacOSExecutorSchema, input);
  }
}
