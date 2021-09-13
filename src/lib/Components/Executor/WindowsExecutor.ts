import { AbstractExecutor } from './Executor';
import {
  WindowsExecutorSchema,
  WindowsResourceClass,
  WindowsResourceClassGenerated,
} from './WindowsExecutor.types';

/**
 * A Windows Virtual Machine (CircleCI Cloud)
 * @see {@link https://circleci.com/docs/2.0/executor-types/#using-the-windows-executor}
 */
export class WindowsExecutor extends AbstractExecutor {
  /**
   * Select one of the available Windows VM Images provided by CircleCI
   * @see - https://circleci.com/developer/machine
   */
  image = 'windows-server-2019-vs2019:stable';
  resourceClass: WindowsResourceClass;
  constructor(resourceClass: WindowsResourceClass = 'medium', image?: string) {
    super(resourceClass);
    this.image = image || this.image;
    this.resourceClass = resourceClass;
  }
  generate(): WindowsExecutorSchema {
    return {
      machine: {
        image: this.image,
      },
      resource_class:
        `windows.${this.resourceClass}` as WindowsResourceClassGenerated,
      shell: 'powershell.exe -ExecutionPolicy Bypass',
    };
  }
}
