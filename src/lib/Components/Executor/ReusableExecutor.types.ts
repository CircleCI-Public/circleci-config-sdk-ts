import { AbstractParameterType } from '../Parameters/Parameters.types';
import { ExecutorSchema } from './Executor.types';

export interface ReusableExecutorSchema {
  executor: {
    name: string;
    [key: string]: AbstractParameterType;
  };
}

export interface ReusableExecutorsSchema {
  [key: string]: ExecutorSchema;
}
