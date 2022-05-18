import { commands, executor, parameters } from '../..';
import { parseJobs } from '../Components/Job';
import { CustomParametersList } from '../Components/Parameters';
import { PipelineParameterLiteral } from '../Components/Parameters/types/CustomParameterLiterals.types';
import { parseWorkflowList } from '../Components/Workflow';
import { Config } from './exports/Config';
import { Validator } from './exports/Validator';
import * as types from './types';
import * as mapping from './exports/Mapping';

export function parseConfig(configIn: unknown): Config {
  const config = configIn as {
    setup: boolean;
    executors?: Record<string, unknown>;
    jobs: Record<string, unknown>;
    commands?: Record<string, unknown>;
    parameters?: Record<string, unknown>;
    workflows: Record<string, unknown>;
  };

  const executorList =
    config.executors && executor.parseReusableExecutors(config.executors);
  const commandList =
    config.commands && commands.reusable.parseCustomCommands(config.commands);
  const parameterList =
    config.parameters && parameters.parseList(config.parameters);
  const jobList = parseJobs(config.jobs, commandList, executorList);
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

export { types, mapping, Config, Validator };
