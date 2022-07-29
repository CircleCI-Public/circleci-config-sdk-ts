import * as CircleCI from '@circleci/circleci-config-sdk';
import { parseReusableCommands } from '../../Components/Commands/parsers';
import { parseReusableExecutors } from '../../Components/Executors/parsers';
import { parseJobList } from '../../Components/Job/parsers';
import { parseParameterList } from '../../Components/Parameters/parsers';
import { parseWorkflowList } from '../../Components/Workflow/parsers';
import { parseGenerable } from '../exports/Parsing';
import { ConfigDependencies, UnknownConfigShape } from '../types';
import { parse } from 'yaml';

/**
 * Parse a whole CircleCI config into a Config instance.
 * If input is a string, it will be passed through YAML parsing.
 * @param configIn - The config to be parsed
 * @returns A complete config
 * @throws Error if any config component not valid
 */
export function parseConfig(configIn: unknown): CircleCI.Config {
  const configProps = (
    typeof configIn == 'string' ? parse(configIn) : configIn
  ) as UnknownConfigShape;

  return parseGenerable<
    UnknownConfigShape,
    CircleCI.Config,
    ConfigDependencies
  >(
    CircleCI.mapping.GenerableType.CONFIG,
    configProps,
    (
      config,
      { jobList, workflows, executorList, commandList, parameterList },
    ) => {
      return new CircleCI.Config(
        config.setup,
        jobList,
        workflows,
        executorList as CircleCI.reusable.ReusableExecutor[] | undefined,
        commandList as CircleCI.reusable.ReusableCommand[] | undefined,
        parameterList as CircleCI.parameters.CustomParametersList<CircleCI.types.parameter.literals.PipelineParameterLiteral>,
      );
    },
    (config) => {
      const executorList =
        config.executors && parseReusableExecutors(config.executors);
      const commandList =
        config.commands && parseReusableCommands(config.commands);
      const parameterList =
        config.parameters && parseParameterList(config.parameters);
      const jobList = parseJobList(config.jobs, commandList, executorList);
      const workflows = parseWorkflowList(config.workflows, jobList);

      return {
        jobList,
        workflows,
        executorList,
        commandList,
        parameterList,
      };
    },
  );
}

// Parser exports
export * from '../../Components/Commands/parsers';
export * from '../../Components/Executors/parsers';
export * from '../../Components/Job/parsers';
export * from '../../Components/Parameters/parsers';
export * from '../../Components/Workflow/parsers';
