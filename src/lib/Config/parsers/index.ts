import { parse } from 'yaml';
import { Config } from '..';
import { parseCustomCommands } from '../../Components/Commands/parsers';
import { parseReusableExecutors } from '../../Components/Executors/parsers';
import { parseJobList } from '../../Components/Job/parsers';
import { CustomParametersList } from '../../Components/Parameters';
import { parseParameterList } from '../../Components/Parameters/parsers';
import { PipelineParameterLiteral } from '../../Components/Parameters/types/CustomParameterLiterals.types';
import { parseWorkflowList } from '../../Components/Workflow/parsers';
import { GenerableType } from '../exports/Mapping';
import { parseGenerable } from '../exports/Parsing';
import { ConfigDependencies, UnknownConfigShape } from '../types';

/**
 * Parse a whole CircleCI config into a Config instance.
 * If input is a string, it will be passed through YAML parsing.
 * @param configIn - The config to be parsed
 * @returns A complete config
 * @throws Error if any config component not valid
 */
export function parseConfig(configIn: unknown): Config {
  const configProps = (
    typeof configIn == 'string' ? parse(configIn) : configIn
  ) as UnknownConfigShape;

  return parseGenerable<UnknownConfigShape, Config, ConfigDependencies>(
    GenerableType.CONFIG,
    configProps,
    (
      config,
      { jobList, workflows, executorList, commandList, parameterList },
    ) => {
      return new Config(
        config.setup,
        jobList,
        workflows,
        executorList,
        commandList,
        parameterList as CustomParametersList<PipelineParameterLiteral>,
      );
    },
    (config) => {
      const executorList =
        config.executors && parseReusableExecutors(config.executors);
      const commandList =
        config.commands && parseCustomCommands(config.commands);
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
