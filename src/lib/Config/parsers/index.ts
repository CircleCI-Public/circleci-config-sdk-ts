import { parse } from 'yaml';
import { Config } from '..';
import { parseCustomCommands } from '../../..';
import { parseReusableExecutors } from '../../Components/Executors/parsers';
import { parseJobList } from '../../Components/Job/parsers';
import { CustomParametersList } from '../../Components/Parameters';
import { parseParameterList } from '../../Components/Parameters/parsers';
import { PipelineParameterLiteral } from '../../Components/Parameters/types/CustomParameterLiterals.types';
import { parseWorkflowList } from '../../Components/Workflow/parsers';
import { UnknownConfigShape } from '../types';

/**
 * Parse a whole CircleCI config into a Config instance.
 * If input is a string, it will be passed through YAML parsing.
 * @param configIn - The config to be parsed
 * @returns A complete config
 * @throws Error if any config component not valid
 */
export function parseConfig(configIn: unknown): Config {
  const config = (
    typeof configIn == 'string' ? parse(configIn) : configIn
  ) as UnknownConfigShape;

  const executorList =
    config.executors && parseReusableExecutors(config.executors);
  const commandList = config.commands && parseCustomCommands(config.commands);
  const parameterList =
    config.parameters && parseParameterList(config.parameters);
  const jobList = parseJobList(config.jobs, commandList, executorList);
  const workflows = parseWorkflowList(config.workflows, jobList);

  return new Config(
    config.setup,
    jobList,
    workflows,
    executorList,
    commandList,
    parameterList as CustomParametersList<PipelineParameterLiteral>,
  );
}
