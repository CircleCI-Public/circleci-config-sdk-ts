/**
 * Instantiate a CircleCI Executor, the build environment for a job. Select a type of executor and supply the required parameters.
 */
import { DockerExecutor } from './exports/DockerExecutor';
import { Executor } from './exports/Executor';
import { MachineExecutor } from './exports/MachineExecutor';
import { MacOSExecutor } from './exports/MacOSExecutor';
import { ReusableExecutor } from './exports/ReusableExecutor';
import { WindowsExecutor } from './exports/WindowsExecutor';
import { DockerResourceClass } from './types/DockerExecutor.types';
import { MachineResourceClass } from './types/MachineExecutor.types';
import { MacOSResourceClass } from './types/MacOSExecutor.types';
import { WindowsResourceClass } from './types/WindowsExecutor.types';

export type ExecutorLiteral = 'docker' | 'machine' | 'macos';

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

      if (DockerExecutor.validate(dockerArgs)) {
        return new DockerExecutor(
          dockerArgs[0].image || 'cimg/base:stable',
          executorIn.resource_class as DockerResourceClass,
        );
      }
    },
    machine: (args) => {
      const windowsResourceClass = executorIn.resource_class.substring(
        'windows.'.length,
      ) as WindowsResourceClass;

      if (executorIn.resource_class.startsWith('windows.')) {
        const windowsArgs = args as Partial<WindowsExecutor>;

        if (WindowsExecutor.validate(windowsArgs)) {
          return new WindowsExecutor(windowsResourceClass, windowsArgs.image);
        }
      }

      const machineArgs = args as Partial<MachineExecutor>;

      if (MachineExecutor.validate(machineArgs)) {
        return new MachineExecutor(
          executorIn.resource_class as MachineResourceClass,
          machineArgs.image,
        );
      }
    },
    macos: (args) => {
      const macOSArgs = args as Partial<MacOSExecutor>;

      if (MacOSExecutor.validate(macOSArgs)) {
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
