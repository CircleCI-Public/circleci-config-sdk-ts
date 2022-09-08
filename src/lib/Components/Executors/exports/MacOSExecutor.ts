import { GenerableType } from '../../../Config/exports/Mapping';
import { ExecutorLiteral } from '../types/Executor.types';
import { ExecutableParameters } from '../types/ExecutorParameters.types';
import {
  MacOSExecutorShape,
  MacOSResourceClass,
} from '../types/MacOSExecutor.types';
import { Executor } from './Executor';

/**
 * A MacOS Virtual Machine with configurable Xcode version.
 * @see {@link https://circleci.com/docs/2.0/executor-types/#using-macos}
 */
export class MacOSExecutor extends Executor<MacOSResourceClass> {
  /**
   * Select an xcode version.
   * @see {@link https://circleci.com/developer/machine/image/macos}
   */
  xcode: string;
  constructor(xcode: string, resource_class: MacOSResourceClass = 'medium') {
    super(resource_class);
    this.xcode = xcode;
  }
  generateContents(): MacOSExecutorShape {
    return {
      xcode: this.xcode,
    };
  }

  get generableType(): GenerableType {
    return GenerableType.MACOS_EXECUTOR;
  }

  get executorLiteral(): ExecutorLiteral {
    return 'macos';
  }
}
