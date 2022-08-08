import * as CircleCI from '@circleci/circleci-config-sdk';
import { errorParsing, parseGenerable } from '../../../Config/exports/Parsing';
import { parseParameterList } from '../../Parameters/parsers';
const subtypeParsers: CircleCI.types.executors.executor.ExecutorSubtypeMap = {
  docker: {
    generableType: CircleCI.mapping.GenerableType.DOCKER_EXECUTOR,
    parse: (args, resourceClass, properties) => {
      const dockerArgs = args as [{ image: string }];
      const [mainImage, ...serviceImages] = dockerArgs;

      return new CircleCI.executors.DockerExecutor(
        mainImage.image,
        resourceClass as CircleCI.types.executors.docker.DockerResourceClass,
        serviceImages,
        properties,
      );
    },
  },
  machine: {
    generableType: CircleCI.mapping.GenerableType.MACHINE_EXECUTOR,
    parse: (args, resourceClass, properties) => {
      const machineArgs = args as Partial<CircleCI.executors.MachineExecutor>;

      return new CircleCI.executors.MachineExecutor(
        resourceClass as CircleCI.types.executors.machine.MachineResourceClass,
        machineArgs.image,
        properties,
      );
    },
  },
  windows: {
    generableType: CircleCI.mapping.GenerableType.WINDOWS_EXECUTOR,
    parse: (args, resourceClass, properties) => {
      const machineArgs = args as Partial<CircleCI.executors.WindowsExecutor>;

      return new CircleCI.executors.WindowsExecutor(
        resourceClass as CircleCI.types.executors.windows.WindowsResourceClass,
        machineArgs.image,
        properties,
      );
    },
  },
  macos: {
    generableType: CircleCI.mapping.GenerableType.MACOS_EXECUTOR,
    parse: (args, resourceClass, properties) => {
      const macOSArgs = args as { xcode: string };

      return new CircleCI.executors.MacOSExecutor(
        macOSArgs.xcode,
        resourceClass as CircleCI.types.executors.macos.MacOSResourceClass,
        properties,
      );
    },
  },
  // Parses a reusable executor by it's name
  executor: {
    generableType: CircleCI.mapping.GenerableType.REUSED_EXECUTOR,
    parse: (args, _, __, reusableExecutors) => {
      const executorArgs = args as
        | { name: string; [key: string]: unknown }
        | string;

      const isFlat = typeof executorArgs === 'string';
      const name = isFlat ? executorArgs : executorArgs.name;

      const executor = reusableExecutors?.find(
        (executor) => executor.name === name,
      );

      if (!executor) {
        throw errorParsing(`Reusable executor ${name} not found in config`);
      }

      type ParameterParsingResult =
        | Record<
            string,
            CircleCI.types.parameter.components.ExecutorParameterTypes
          >
        | undefined;

      let parameters: ParameterParsingResult = undefined;

      if (!isFlat) {
        // destructure and ignore the name.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { name, ...parsedParameters } = executorArgs;

        if (Object.values(parsedParameters).length > 0) {
          parameters = parsedParameters as
            | Record<
                string,
                CircleCI.types.parameter.components.ExecutorParameterTypes
              >
            | undefined;
        }
      }

      return executor.reuse(parameters);
    },
  },
};

/**
 * Helper function to extract ExecutableProperties from an executable.
 */
export function extractExecutableProps(
  executable: CircleCI.types.executors.executor.UnknownExecutableShape,
): CircleCI.types.executors.executor.ExecutableProperties {
  const keys = ['description', 'shell', 'working_directory', 'environment'];
  let notNull = false;
  const values = Object.assign(
    {},
    ...keys.map((key) => {
      const value = executable[key];

      if (value) {
        notNull = true;
      }

      return { [key]: value };
    }),
  );

  return notNull ? values : undefined;
}

/**
 * Parse executor from an executable object, such as a job.
 * @param executableIn - The executable object to parse.
 * @param reusableExecutors - The reusable executors reference to use.
 * @returns An executor instance of the determined type.
 * @throws Error if a valid executor type is not found on the object.
 */
export function parseExecutor(
  executableIn: unknown,
  reusableExecutors?: CircleCI.reusable.ReusableExecutor[],
): CircleCI.types.job.AnyExecutor {
  const executableArgs =
    executableIn as CircleCI.types.executors.executor.UnknownExecutableShape;
  let resourceClass = executableArgs.resource_class;
  let executorType:
    | CircleCI.types.executors.executor.ExecutorUsageLiteral
    | 'windows'
    | undefined;
  let executorKey:
    | CircleCI.types.executors.executor.ExecutorUsageLiteral
    | undefined;
  const winPrefix = 'windows.';

  if (resourceClass?.startsWith(winPrefix)) {
    resourceClass = resourceClass.substring(
      winPrefix.length,
    ) as CircleCI.types.executors.windows.WindowsResourceClass;
    executorType = 'windows';
    executorKey = 'machine';
  } else {
    executorKey = Object.keys(executableArgs).find(
      (subtype) => subtype in subtypeParsers,
    ) as CircleCI.types.executors.executor.ExecutorLiteral | undefined;
  }

  if (!executorKey) {
    throw errorParsing(`No executor found.`);
  }

  const { generableType, parse } = subtypeParsers[executorType || executorKey];

  return parseGenerable<
    CircleCI.types.executors.executor.UnknownExecutableShape,
    CircleCI.types.job.AnyExecutor
  >(generableType, executableArgs, (args) => {
    return parse(
      args[
        executorKey as CircleCI.types.executors.executor.ExecutorUsageLiteral
      ],
      resourceClass,
      extractExecutableProps(executableArgs),
      reusableExecutors,
    );
  });
}
/**
 * Parses a config's list of reusable executors.
 * @param executorListIn - The executor list to parse.
 * @returns An array of reusable executors.
 * @throws Error if a reusable executor is not able to be parsed.
 */
export function parseReusableExecutors(
  executorListIn: unknown,
): CircleCI.reusable.ReusableExecutor[] {
  const executorListArgs =
    executorListIn as CircleCI.types.executors.executor.ReusableExecutorDefinition[];

  const parsedList = Object.entries(executorListArgs).map(([name, executor]) =>
    parseReusableExecutor(name, executor),
  );

  return parsedList;
}

export function parseReusableExecutor(
  name: string,
  executableIn: unknown,
): CircleCI.reusable.ReusableExecutor {
  return parseGenerable<
    CircleCI.types.executors.executor.ReusableExecutorDefinition,
    CircleCI.reusable.ReusableExecutor,
    CircleCI.types.executors.reusable.ReusableExecutorDependencies
  >(
    CircleCI.mapping.GenerableType.REUSABLE_EXECUTOR,
    executableIn,
    (_, { parametersList, executor }) => {
      return new CircleCI.reusable.ReusableExecutor(
        name,
        executor,
        parametersList,
      );
    },
    ({ parameters, ...executorArgs }) => {
      const parametersList =
        parameters &&
        (parseParameterList(
          parameters,
          CircleCI.mapping.ParameterizedComponent.EXECUTOR,
        ) as
          | CircleCI.parameters.CustomParametersList<CircleCI.types.parameter.literals.ExecutorParameterLiteral>
          | undefined);

      const executor = parseExecutor(
        executorArgs,
        undefined,
      ) as CircleCI.executors.Executor;

      return {
        parametersList,
        executor,
      };
    },
    name,
  );
}
