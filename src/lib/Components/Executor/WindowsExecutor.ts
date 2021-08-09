import { AbstractExecutor } from './Executor';
import {
  WindowsExecutorSchema,
  WindowsResourceClass,
} from './WindowsExecutor.types';

/**
 * A Windows Virtual Machine (CircleCI Cloud)
 * @see {@link https://circleci.com/docs/2.0/executor-types/#using-the-windows-executor}
 */
export class WindowsExecutor extends AbstractExecutor {
  image = 'windows-server-2019-vs2019:stable';
  resourceClass: WindowsResourceClass;
  constructor(
    name: string,
    resourceClass: WindowsResourceClass = 'medium',
    image?: string,
  ) {
    super(name, resourceClass);
    this.image = image || this.image;
    this.resourceClass = resourceClass;
  }
  generate(): WindowsExecutorSchema {
    return {
      [this.name]: {
        machine: {
          image: this.image,
        },
        resource_class: `windows.${this.resourceClass}`,
        shell: 'powershell.exe -ExecutionPolicy Bypass',
      },
    };
  }
}
