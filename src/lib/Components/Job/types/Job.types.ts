import { Command } from '../../Commands/exports/Command';
import { Executor } from '../../Executors';
import { ExecutorShape } from '../../Executors/types/Executor.types';
import { CustomParametersList } from '../../Parameters';
import { CustomParametersListShape } from '../../Parameters/types';
import { JobParameterLiteral } from '../../Parameters/types/CustomParameterLiterals.types';
import { ReusableExecutor } from '../../Reusable';

export type JobStepsShape = {
  steps: unknown[]; // CommandSchemas for any command.
};

export type JobContentsShape = JobStepsShape & ExecutorShape;

export type JobsShape = {
  [key: string]: JobContentsShape;
};

export type AnyExecutor = ReusableExecutor | Executor;

export type ParameterizedJobContents = JobContentsShape & {
  parameters: CustomParametersListShape;
};

export type JobDependencies = {
  executor: Executor | ReusableExecutor;
  steps: Command[];
  parametersList?: CustomParametersList<JobParameterLiteral>;
};
