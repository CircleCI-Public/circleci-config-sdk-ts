import Executor from './Executor';
import {
  WindowsExecutorSchema,
  WindowsResourceClass,
} from './WindowsExecutor.types';
export class WindowsExecutor extends Executor {
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
