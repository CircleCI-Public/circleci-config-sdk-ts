import {
  GenerableType,
  ParameterizedComponent,
} from '../../../Config/exports/Mapping';
import { errorParsing, parseGenerable } from '../../../Config/exports/Parsing';
import { CustomParametersList } from '../../Parameters';
import { parseParameterList } from '../../Parameters/parsers';
import { ExecutorParameterLiteral } from '../../Parameters/types/CustomParameterLiterals.types';
import { DockerExecutor } from '../exports/DockerExecutor';
import { Executor } from '../exports/Executor';
import { MachineExecutor } from '../exports/MachineExecutor';
import { MacOSExecutor } from '../exports/MacOSExecutor';
import { ReusableExecutor } from '../exports/ReusableExecutor';
import { DockerResourceClass } from '../types/DockerExecutor.types';
import {
  ExecutorLiteral,
  ExecutorSubtypeMap,
  ExecutorUsageLiteral,
  ReusableExecutorDefinition,
  UnknownExecutorShape,
} from '../types/Executor.types';
import { MachineResourceClass } from '../types/MachineExecutor.types';
import { MacOSResourceClass } from '../types/MacOSExecutor.types';
import { WindowsResourceClass } from '../types/WindowsExecutor.types';

const subtypeParsers: ExecutorSubtypeMap = {
  docker: {
    generableType: GenerableType.DOCKER_EXECUTOR,
    parse: (args, resourceClass) => {
      const dockerArgs = args as [{ image: string }];

      return new DockerExecutor(
        dockerArgs[0].image || 'cimg/base:stable',
        resourceClass as DockerResourceClass,
      );
    },
  },
  machine: {
    generableType: GenerableType.MACHINE_EXECUTOR,
    parse: (args, resourceClass) => {
      const machineArgs = args as Partial<MachineExecutor>;

      return new MachineExecutor(
        resourceClass as MachineResourceClass,
        machineArgs.image,
      );
    },
  },
  windows: {
    generableType: GenerableType.WINDOWS_EXECUTOR,
    parse: (args, resourceClass) => {
      const machineArgs = args as Partial<MachineExecutor>;

      return new MachineExecutor(
        resourceClass as MachineResourceClass,
        machineArgs.image,
      );
    },
  },
  macos: {
    generableType: GenerableType.MACOS_EXECUTOR,
    parse: (args, resourceClass) => {
      const macOSArgs = args as Partial<MacOSExecutor>;

      return new MacOSExecutor(
        macOSArgs.xcode || '13.1',
        resourceClass as MacOSResourceClass,
      );
    },
  },
  // Parses a reusable executor by it's name
  executor: {
    generableType: GenerableType.ANY_EXECUTOR,
    parse: (args, resourceClass, reusableExecutors) => {
      const executorArgs = args as
        | { name: string; [key: string]: unknown }
        | string;

      const name =
        typeof executorArgs === 'string' ? executorArgs : executorArgs.name;

      const executor = reusableExecutors?.find(
        (executor) => executor.name === name,
      );

      if (!executor) {
        throw errorParsing(`Reusable executor ${name} not found in config`);
      }

      return executor;
    },
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
): Executor | ReusableExecutor {
  const executableArgs = executableIn as UnknownExecutorShape;
  let resourceClass = executableArgs.resource_class;
  let executorType: ExecutorUsageLiteral | 'windows' | undefined;
  const winPrefix = 'windows.';

  if (resourceClass.startsWith(winPrefix)) {
    resourceClass = resourceClass.substring(
      winPrefix.length,
    ) as WindowsResourceClass;
    executorType = 'windows';
  } else {
    executorType = Object.keys(executableArgs).find(
      (subtype) => subtype in subtypeParsers,
    ) as ExecutorLiteral | undefined;
  }

  if (!executorType) {
    throw errorParsing('No executor found.');
  }

  const executorArgs = executableArgs[executorType];
  const { generableType, parse } = subtypeParsers[executorType];

  return parseGenerable<UnknownExecutorShape, Executor | ReusableExecutor>(
    generableType,
    executorArgs,
    (args) => {
      return parse(args, resourceClass, reusableExecutors);
    },
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
  const executorListArgs = executorListIn as ReusableExecutorDefinition[];

  const parsedList = Object.entries(executorListArgs).map(([name, executor]) =>
    parseReusableExecutor(name, executor),
  );

  return parsedList;
}

export function parseReusableExecutor(
  name: string,
  executorIn: unknown,
): ReusableExecutor {
  return parseGenerable<ReusableExecutorDefinition, ReusableExecutor>(
    GenerableType.REUSABLE_EXECUTOR,
    executorIn,
    (executorArgs) => {
      const parametersList =
        executorArgs.parameters &&
        (parseParameterList(
          executorArgs.parameters,
          ParameterizedComponent.EXECUTOR,
        ) as CustomParametersList<ExecutorParameterLiteral> | undefined);

      const parsedExecutor = parseExecutor(executorIn, undefined);

      return new ReusableExecutor(
        name,
        parsedExecutor as Executor,
        parametersList,
      );
    },
  );
}
