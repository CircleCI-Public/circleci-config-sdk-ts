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
import { ExecutorLiteral, ExecutorLiteralUsage } from './types/Executor.types';
import { MachineResourceClass } from './types/MachineExecutor.types';
import { MacOSResourceClass } from './types/MacOSExecutor.types';
import { WindowsResourceClass } from './types/WindowsExecutor.types';
import { Config } from '../../Config';

/**
 * Parse executor type from an object with an executor.
 * @returns Executor of the corresponding type
 */
function parse(
  executorIn: {
    resource_class: string;
    [key: string]: unknown;
  },
  config?: Config,
): Executor | ReusableExecutor | undefined {
  const subtypes: {
    [key in ExecutorLiteralUsage]: (
      args: unknown,
    ) => Executor | ReusableExecutor | undefined;
  } = {
    docker: (args) => {
      const dockerArgs = args as [{ image: string }];

      if (
        ConfigValidator.getGeneric().validateGenerable(
          GenerableType.DOCKER_EXECUTOR,
          dockerArgs,
        )
      ) {
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
          ConfigValidator.getGeneric().validateGenerable(
            GenerableType.WINDOWS_EXECUTOR,
            windowsArgs,
          )
        ) {
          return new WindowsExecutor(windowsResourceClass, windowsArgs.image);
        }
      }

      const machineArgs = args as Partial<MachineExecutor>;

      if (
        ConfigValidator.getGeneric().validateGenerable(
          GenerableType.MACHINE_EXECUTOR,
          machineArgs,
        )
      ) {
        return new MachineExecutor(
          executorIn.resource_class as MachineResourceClass,
          machineArgs.image,
        );
      }
    },
    macos: (args) => {
      const macOSArgs = args as Partial<MacOSExecutor>;

      if (
        ConfigValidator.getGeneric().validateGenerable(
          GenerableType.MACOS_EXECUTOR,
          macOSArgs,
        )
      ) {
        return new MacOSExecutor(
          macOSArgs.xcode || '13.1',
          executorIn.resource_class as MacOSResourceClass,
        );
      }
    },
    executor: (args) => {
      const executorArgs = args as
        | { name: string; [key: string]: unknown }
        | string;

      const name =
        typeof executorArgs === 'string' ? executorArgs : executorArgs.name;

      const executor = config?.executors?.find(
        (executor) => executor.name === name,
      );

      if (executor) {
        return executor;
      }

      throw new Error('Reusable executor not found on config');
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
