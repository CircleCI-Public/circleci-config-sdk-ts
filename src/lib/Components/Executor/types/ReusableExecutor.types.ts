import {
  AnyParameterType,
  StringParameter,
} from '../../Parameters/types/Parameters.types';
import { ExecutorShape } from './Executor.types';

export interface ReusableExecutorShape {
  executor: {
    name: StringParameter;
    [key: string]: AnyParameterType;
  };
}

export interface ReusableExecutorsShape {
  [key: string]: ExecutorShape;
}
