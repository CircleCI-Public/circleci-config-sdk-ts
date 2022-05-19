import { Executor, ReusableExecutor } from '../../Executors';
import { ExecutorShape } from '../../Executors/types/Executor.types';

export interface JobStepsShape {
  steps: unknown[]; // CommandSchemas for any command.
}

export type JobContentShape = JobStepsShape & ExecutorShape;

export interface JobShape {
  [key: string]: JobContentShape;
}

export type AnyExecutor = ReusableExecutor | Executor;
