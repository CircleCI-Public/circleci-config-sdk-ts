import { Command } from '../../Commands/exports/Command';
import { Executor } from '../../Executors';
import { ReusedExecutor } from '../../Executors/exports/ReusedExecutor';
import { AnyExecutorShape } from '../../Executors/types/Executor.types';
import { CustomParametersList } from '../../Parameters';
import { CustomParametersListShape } from '../../Parameters/types';
import { JobParameterLiteral } from '../../Parameters/types/CustomParameterLiterals.types';

export type JobStepsShape = {
  steps: unknown[]; // CommandSchemas for any command.
};

export type JobContentsShape = JobStepsShape & AnyExecutorShape;

export type JobsShape = {
  [key: string]: JobContentsShape;
};

export type AnyExecutor = ReusedExecutor | Executor;

export type ParameterizedJobContents = JobContentsShape & {
  parameters: CustomParametersListShape;
};

export type JobDependencies = {
  executor: AnyExecutor;
  steps: Command[];
  parametersList?: CustomParametersList<JobParameterLiteral>;
};
