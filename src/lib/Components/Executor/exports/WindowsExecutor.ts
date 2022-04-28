import { GenerableType } from '../../../Config/types/Config.types';
import { ExecutorParameters } from '../types/ExecutorParameters.types';
import {
  WindowsExecutorShape,
  WindowsResourceClass,
  WindowsResourceClassGenerated,
} from '../types/WindowsExecutor.types';
import { Executor } from './Executor';

/**
 * A Windows Virtual Machine (CircleCI Cloud)
 * @see {@link https://circleci.com/docs/2.0/executor-types/#using-the-windows-executor}
 */
export class WindowsExecutor extends Executor {
  /**
   * Select one of the available Windows VM Images provided by CircleCI
   * @see - https://circleci.com/developer/machine
   */
  image = 'windows-server-2019-vs2019:stable';
  resource_class: WindowsResourceClass;
  parameters: ExecutorParameters;

  static defaultShell = 'powershell.exe -ExecutionPolicy Bypass';

  constructor(
    resource_class: WindowsResourceClass = 'medium',
    image?: string,
    parameters?: ExecutorParameters,
  ) {
    super(resource_class, parameters);

    this.image = image || this.image;
    this.resource_class = resource_class;
    this.parameters = {
      shell: WindowsExecutor.defaultShell,
      ...parameters,
    };
  }
  generate(): WindowsExecutorShape {
    return {
      machine: {
        image: this.image,
      },
      resource_class:
        `windows.${this.resource_class}` as WindowsResourceClassGenerated,
      shell: this.parameters.shell || WindowsExecutor.defaultShell,
    };
  }

  get generableType(): GenerableType {
    return GenerableType.WINDOWS_EXECUTOR;
  }
}
