import { Executor } from '../../Executors';
import { ExecutorShape } from '../../Executors/types/Executor.types';
import { CustomParametersListShape } from '../../Parameters/types';
import { ReusableExecutor } from '../../Reusable';

export interface JobStepsShape {
  steps: unknown[]; // CommandSchemas for any command.
}

export type JobContentsShape = JobStepsShape & ExecutorShape;

export interface JobShape {
  [key: string]: JobContentsShape;
}

export type AnyExecutor = ReusableExecutor | Executor;

export type ParameterizedJobContents = JobContentsShape & {
  parameters: CustomParametersListShape;
};
