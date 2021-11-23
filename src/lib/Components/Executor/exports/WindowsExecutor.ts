import { ValidatorResult } from 'jsonschema';
import { Config } from '../../../Config';
import { Executor } from './Executor';
import { windowsExecutorSchema } from '../schemas/Executor.schema';
import {
  WindowsExecutorShape,
  WindowsResourceClass,
  WindowsResourceClassGenerated,
} from '../types/WindowsExecutor.types';
import { ExecutorParameters } from '../types/ExecutorParameters.types';

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
    super(resource_class);

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

  static validate(input: unknown): ValidatorResult {
    return Config.validator.validate(input, windowsExecutorSchema);
  }
}
