import { ExecutorShape } from '../../Executor/types/Executor.types';

export interface JobStepsShape {
  steps: unknown[]; // CommandSchemas for any command.
}

export type JobContentShape = JobStepsShape & ExecutorShape;

export interface JobShape {
  [key: string]: JobContentShape;
}
