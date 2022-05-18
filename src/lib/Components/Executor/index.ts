/**
 * Instantiate a CircleCI Executor, the build environment for a job. Select a type of executor and supply the required parameters.
 */
import { parameters } from '../../..';
import {
  GenerableType,
  ParameterizedComponent,
} from '../../Config/exports/Mapping';
import { Validator } from '../../Config/exports/Validator';
import { CustomParametersList } from '../Parameters';
import { ExecutorParameterLiteral } from '../Parameters/types/CustomParameterLiterals.types';
import { DockerExecutor } from './exports/DockerExecutor';
import { Executor } from './exports/Executor';
import { MachineExecutor } from './exports/MachineExecutor';
import { MacOSExecutor } from './exports/MacOSExecutor';
import { ReusableExecutor } from './exports/ReusableExecutor';
import { WindowsExecutor } from './exports/WindowsExecutor';
import types from './types';
import { DockerResourceClass } from './types/DockerExecutor.types';
import { ExecutorLiteral, ExecutorLiteralUsage } from './types/Executor.types';
import { MachineResourceClass } from './types/MachineExecutor.types';
import { MacOSResourceClass } from './types/MacOSExecutor.types';
import { WindowsResourceClass } from './types/WindowsExecutor.types';

export type UnknownExecutorShape = {
  resource_class: string;
  [key: string]: unknown;
};

/**
 * Parse executor type from an object with an executor.
 * @returns Executor of the corresponding type
 */
export function parse(
  executorIn: unknown,
  executors?: ReusableExecutor[],
): Executor | ReusableExecutor | undefined {
  const executorArgs = executorIn as UnknownExecutorShape;

  const subtypes: {
    [key in ExecutorLiteralUsage]: (
      args: unknown,
    ) => Executor | ReusableExecutor | undefined;
  } = {
    docker: (args) => {
      const dockerArgs = args as [{ image: string }];

      if (
        Validator.validateGenerable(GenerableType.DOCKER_EXECUTOR, dockerArgs)
      ) {
        return new DockerExecutor(
          dockerArgs[0].image || 'cimg/base:stable',
          executorArgs.resource_class as DockerResourceClass,
        );
      }
    },
    machine: (args) => {
      const winPrefix = 'windows.';

      if (executorArgs.resource_class?.startsWith(winPrefix)) {
        const windowsResourceClass = executorArgs.resource_class.substring(
          winPrefix.length,
        ) as WindowsResourceClass;

        const windowsArgs = args as Partial<WindowsExecutor>;

        if (
          Validator.validateGenerable(
            GenerableType.WINDOWS_EXECUTOR,
            windowsArgs,
          )
        ) {
          return new WindowsExecutor(windowsResourceClass, windowsArgs.image);
        }
      }

      const machineArgs = args as Partial<MachineExecutor>;

      if (
        Validator.validateGenerable(GenerableType.MACHINE_EXECUTOR, machineArgs)
      ) {
        return new MachineExecutor(
          executorArgs.resource_class as MachineResourceClass,
          machineArgs.image,
        );
      }
    },
    macos: (args) => {
      const macOSArgs = args as Partial<MacOSExecutor>;

      if (
        Validator.validateGenerable(GenerableType.MACOS_EXECUTOR, macOSArgs)
      ) {
        return new MacOSExecutor(
          macOSArgs.xcode || '13.1',
          executorArgs.resource_class as MacOSResourceClass,
        );
      }
    },
    executor: (args) => {
      const executorArgs = args as
        | { name: string; [key: string]: unknown }
        | string;

      const name =
        typeof executorArgs === 'string' ? executorArgs : executorArgs.name;

      const executor = executors?.find((executor) => executor.name === name);

      if (executor) {
        return executor;
      }

      throw new Error('Reusable executor not found on config');
    },
  };

  const executorType = Object.keys(executorArgs).find(
    (subtype) => subtype in subtypes,
  ) as ExecutorLiteral | undefined;

  // @todo: move to parsing
  if (!executorType) {
    throw new Error('Invalid executor type has been passed');
  }

  // eslint-disable-next-line security/detect-object-injection
  const parsedExecutor = subtypes[executorType](executorArgs[executorType]);

  return parsedExecutor;
}

export function parseReusableExecutors(
  executorListIn: unknown,
): ReusableExecutor[] {
  const executorListArgs = executorListIn as {
    [key: string]: (UnknownExecutorShape & {
      parameters?: { [key: string]: unknown };
    })[]; // TODO: Clean this
  };

  const parametersList =
    executorListArgs.parameters &&
    (parameters.parseList(
      executorListArgs.parameters,
      ParameterizedComponent.EXECUTOR,
    ) as CustomParametersList<ExecutorParameterLiteral> | undefined);

  return Object.entries(executorListArgs).map(([name, executor]) => {
    const parsedExecutor = parse(executor, undefined);

    if (parsedExecutor) {
      return new ReusableExecutor(
        name,
        parsedExecutor as Executor,
        parametersList,
      );
    }

    throw new Error('Invalid executor has been passed');
  });
}

export {
  DockerExecutor,
  MachineExecutor,
  MacOSExecutor,
  WindowsExecutor,
  ReusableExecutor,
  Executor,
  types,
};
