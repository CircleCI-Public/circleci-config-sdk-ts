import Executor from '../../Components/Executor/Executor';
import { MacOSExecutorSchema, MacOSResourceClass } from './MacOSExecutor.types';

export class MacOSExecutor extends Executor {
  resourceClass: MacOSResourceClass;
  /**
   * Select an xcode version
   * @see {@link https://circleci.com/docs/2.0/testing-ios/#supported-xcode-versions}
   */
  xcode: string;
  constructor(
    name: string,
    xcode: string,
    resourceClass: MacOSResourceClass = 'medium',
  ) {
    super(name, resourceClass);
    this.xcode = xcode;
    this.resourceClass = resourceClass;
  }
  generate(): MacOSExecutorSchema {
    return {
      [this.name]: {
        macos: {
          xcode: this.xcode,
        },
        resource_class: this.resourceClass,
      },
    };
  }
}
