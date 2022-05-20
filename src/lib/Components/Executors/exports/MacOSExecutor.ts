import { GenerableType } from '../../../Config/exports/Mapping';
import { ExecutorParameters } from '../types/ExecutorParameters.types';
import {
  MacOSExecutorShape,
  MacOSResourceClass,
} from '../types/MacOSExecutor.types';
import { Executor } from './Executor';

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

  get generableType(): GenerableType {
    return GenerableType.MACOS_EXECUTOR;
  }
}
