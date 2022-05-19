import { Config } from '..';
import { parseCustomCommands } from '../../..';
import { parseReusableExecutors } from '../../Components/Executors/parsers';
import { parseJobList } from '../../Components/Job/parsers';
import { CustomParametersList } from '../../Components/Parameters';
import { parseParameterList } from '../../Components/Parameters/parsers';
import { PipelineParameterLiteral } from '../../Components/Parameters/types/CustomParameterLiterals.types';
import { parseWorkflowList } from '../../Components/Workflow/parsers';

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
