/**
 * Instantiate a CircleCI Executor, the build environment for a job. Select a type of executor and supply the required parameters.
 */
import { GenerableType } from '../../Config/types/Config.types';
import { ConfigValidator } from '../../Config/ConfigValidator';
import { DockerExecutor } from './exports/DockerExecutor';
import { Executor } from './exports/Executor';
import { MachineExecutor } from './exports/MachineExecutor';
import { MacOSExecutor } from './exports/MacOSExecutor';
import { ReusableExecutor } from './exports/ReusableExecutor';
import { WindowsExecutor } from './exports/WindowsExecutor';
import { DockerResourceClass } from './types/DockerExecutor.types';
import { ExecutorLiteral } from './types/Executor.types';
import { MachineResourceClass } from './types/MachineExecutor.types';
import { MacOSResourceClass } from './types/MacOSExecutor.types';
import { WindowsResourceClass } from './types/WindowsExecutor.types';

/**
 * Parse executor type from an object with an executor.
 * @returns Executor of the corresponding type
 */
function parse(executorIn: {
  resource_class: string;
  [key: string]: unknown;
}): Executor | undefined {
  const subtypes: {
    [key in ExecutorLiteral]: (args: unknown) => Executor | undefined;
  } = {
    docker: (args) => {
      const dockerArgs = args as [{ image: string }];

      if (ConfigValidator.validate(GenerableType.DOCKER_EXECUTOR, dockerArgs)) {
        return new DockerExecutor(
          dockerArgs[0].image || 'cimg/base:stable',
          executorIn.resource_class as DockerResourceClass,
        );
      }
    },
    machine: (args) => {
      const winPrefix = 'windows.';

      if (executorIn.resource_class?.startsWith(winPrefix)) {
        const windowsResourceClass = executorIn.resource_class.substring(
          winPrefix.length,
        ) as WindowsResourceClass;

        const windowsArgs = args as Partial<WindowsExecutor>;

        if (
          ConfigValidator.validate(GenerableType.WINDOWS_EXECUTOR, windowsArgs)
        ) {
          return new WindowsExecutor(windowsResourceClass, windowsArgs.image);
        }
      }

      const machineArgs = args as Partial<MachineExecutor>;

      if (
        ConfigValidator.validate(GenerableType.MACHINE_EXECUTOR, machineArgs)
      ) {
        return new MachineExecutor(
          executorIn.resource_class as MachineResourceClass,
          machineArgs.image,
        );
      }
    },
    macos: (args) => {
      const macOSArgs = args as Partial<MacOSExecutor>;

      if (ConfigValidator.validate(GenerableType.MACOS_EXECUTOR, macOSArgs)) {
        return new MacOSExecutor(
          macOSArgs.xcode || '13.1',
          executorIn.resource_class as MacOSResourceClass,
        );
      }
    },
  };

  const executorType = Object.keys(executorIn).find(
    (subtype) => subtype in subtypes,
  ) as ExecutorLiteral | undefined;

  // @todo: move to parsing
  if (!executorType) {
    throw new Error('Invalid executor type has been passed');
  }

  // eslint-disable-next-line security/detect-object-injection
  const parsedExecutor = subtypes[executorType](executorIn[executorType]);

  return parsedExecutor;
}

export {
  DockerExecutor,
  MachineExecutor,
  MacOSExecutor,
  WindowsExecutor,
  ReusableExecutor,
  parse,
};
