import { GenerableType } from '../../../Config/exports/Mapping';
import { ExecutorLiteral } from '../types/Executor.types';
import { ExecutableParameters } from '../types/ExecutorParameters.types';
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
export class WindowsExecutor extends Executor<WindowsResourceClass> {
  /**
   * Select one of the available Windows VM Images provided by CircleCI
   * @see - https://circleci.com/developer/machine
   */
  image = 'windows-server-2019-vs2019:stable';

  static defaultShell = 'powershell.exe -ExecutionPolicy Bypass';

  constructor(
    resource_class: WindowsResourceClass = 'medium',
    image?: string,
    parameters?: ExecutableParameters,
  ) {
    super(resource_class, {
      shell: WindowsExecutor.defaultShell,
      ...parameters,
    });

    this.image = image || this.image;
    this.resource_class = resource_class;
    this.parameters = {
      shell: WindowsExecutor.defaultShell,
      ...parameters,
    };
  }

  generateContents(): WindowsExecutorShape {
    return {
      image: this.image,
    };
  }

  get generableType(): GenerableType {
    return GenerableType.WINDOWS_EXECUTOR;
  }

  get executorLiteral(): ExecutorLiteral {
    return 'machine';
  }

  get generateResourceClass(): WindowsResourceClassGenerated {
    return `windows.${this.resource_class}`;
  }
}
