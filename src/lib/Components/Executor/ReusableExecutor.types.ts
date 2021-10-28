import { PipelineParameterValueTypes } from '../../Config/Pipeline/Parameters';
import { ExecutorSchema } from './Executor.types';

export interface ReusableExecutorSchema {
  executor: {
    name: string;
    [key: string]: PipelineParameterValueTypes;
  };
}

export interface ReusableExecutorsSchema {
  [key: string]: ExecutorSchema;
}
