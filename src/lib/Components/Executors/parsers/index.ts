import { Validator } from '../../../Config';
import {
  GenerableType,
  ParameterizedComponent,
} from '../../../Config/exports/Mapping';
import { CustomParametersList } from '../../Parameters';
import { parseParameterList } from '../../Parameters/parsers';
import { ExecutorParameterLiteral } from '../../Parameters/types/CustomParameterLiterals.types';
import { DockerExecutor } from '../exports/DockerExecutor';
import { Executor } from '../exports/Executor';
import { MachineExecutor } from '../exports/MachineExecutor';
import { MacOSExecutor } from '../exports/MacOSExecutor';
import { ReusableExecutor } from '../exports/ReusableExecutor';
import { WindowsExecutor } from '../exports/WindowsExecutor';
import { DockerResourceClass } from '../types/DockerExecutor.types';
import {
  ExecutorLiteral,
  ExecutorLiteralUsage,
  UnknownExecutorShape as UnknownExecutableShape,
} from '../types/Executor.types';
import { MachineResourceClass } from '../types/MachineExecutor.types';
import { MacOSResourceClass } from '../types/MacOSExecutor.types';
import { WindowsResourceClass } from '../types/WindowsExecutor.types';

const subtypeParsers: {
  [key in ExecutorLiteralUsage]: (
    args: unknown,
    resourceClass: string,
    reusableExecutors?: ReusableExecutor[],
  ) => Executor | ReusableExecutor | undefined;
} = {
  docker: (args, resourceClass) => {
    const dockerArgs = args as [{ image: string }];

    if (
      Validator.validateGenerable(GenerableType.DOCKER_EXECUTOR, dockerArgs)
    ) {
      return new DockerExecutor(
        dockerArgs[0].image || 'cimg/base:stable',
        resourceClass as DockerResourceClass,
      );
    }
  },
  machine: (args, resourceClass) => {
    const winPrefix = 'windows.';

    if (resourceClass?.startsWith(winPrefix)) {
      const windowsResourceClass = resourceClass.substring(
        winPrefix.length,
      ) as WindowsResourceClass;

      const windowsArgs = args as Partial<WindowsExecutor>;

      if (
        Validator.validateGenerable(GenerableType.WINDOWS_EXECUTOR, windowsArgs)
      ) {
        return new WindowsExecutor(windowsResourceClass, windowsArgs.image);
      }
    }

    const machineArgs = args as Partial<MachineExecutor>;

    if (
      Validator.validateGenerable(GenerableType.MACHINE_EXECUTOR, machineArgs)
    ) {
      return new MachineExecutor(
        resourceClass as MachineResourceClass,
        machineArgs.image,
      );
    }
  },
  macos: (args, resourceClass) => {
    const macOSArgs = args as Partial<MacOSExecutor>;

    if (Validator.validateGenerable(GenerableType.MACOS_EXECUTOR, macOSArgs)) {
      return new MacOSExecutor(
        macOSArgs.xcode || '13.1',
        resourceClass as MacOSResourceClass,
      );
    }
  },
  // Parses a reusable executor by it's name
  executor: (args, resourceClass, reusableExecutors) => {
    const executorArgs = args as
      | { name: string; [key: string]: unknown }
      | string;

    const name =
      typeof executorArgs === 'string' ? executorArgs : executorArgs.name;

    const executor = reusableExecutors?.find(
      (executor) => executor.name === name,
    );

    if (executor) {
      return executor;
    }

    throw new Error('Reusable executor not found on config');
  },
};

/**
 * Parse executor from an executable object, such as a job.
 * @param executableIn - The executable object to parse.
 * @param reusableExecutors - The reusable executors reference to use.
 * @returns An executor instance of the determined type.
 * @throws Error if a valid executor type is not found on the object.
 */
export function parseExecutor(
  executableIn: unknown,
  reusableExecutors?: ReusableExecutor[],
): Executor | ReusableExecutor | undefined {
  const executableArgs = executableIn as UnknownExecutableShape;

  const executorType = Object.keys(executableArgs).find(
    (subtype) => subtype in subtypeParsers,
  ) as ExecutorLiteral | undefined;

  if (!executorType) {
    throw new Error(`Invalid executor type has been passed`);
  }

  const subtypeParser = subtypeParsers[executorType];
  const executorArgs = executableArgs[executorType];
  // eslint-disable-next-line security/detect-object-injection
  return subtypeParser(
    executorArgs,
    executableArgs.resource_class,
    reusableExecutors,
  );
}

/**
 * Parses a config's list of reusable executors.
 * @param executorListIn - The executor list to parse.
 * @returns An array of reusable executors.
 * @throws Error if a reusable executor is not able to be parsed.
 */
export function parseReusableExecutors(
  executorListIn: unknown,
): ReusableExecutor[] {
  const executorListArgs = executorListIn as {
    [key: string]: (UnknownExecutableShape & {
      parameters?: { [key: string]: unknown };
    })[]; // TODO: Clean this
  };

  const parametersList =
    executorListArgs.parameters &&
    (parseParameterList(
      executorListArgs.parameters,
      ParameterizedComponent.EXECUTOR,
    ) as CustomParametersList<ExecutorParameterLiteral> | undefined);

  return Object.entries(executorListArgs).map(([name, executor]) => {
    const parsedExecutor = parseExecutor(executor, undefined);

    if (parsedExecutor) {
      return new ReusableExecutor(
        name,
        parsedExecutor as Executor,
        parametersList,
      );
    }

    throw new Error('Was unable to parse a reusable executor');
  });
}
