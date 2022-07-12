import {
  AnyParameterType,
  CustomParametersListShape,
  StringParameter,
} from '../../Parameters/types';
import { ExecutorShape } from './Executor.types';

/**
 * The shape output when a reusable executor is generated for a job
 */
export type ReusableExecutorJobRefShape = {
  executor: {
    name: StringParameter;
    [key: string]: AnyParameterType;
  };
};

export type ReusableExecutorsShape = {
  [key: string]: ExecutorShape & {
    parameters?: CustomParametersListShape;
  };
};

/**
 * The shape output when a reusable executor is generated for a job
 */
export type ReusedExecutorShapeContents =
  | {
      name: StringParameter;
      [key: string]: AnyParameterType;
    }
  | StringParameter;

/**
 * The shape output when a reusable executor is generated for a job
 */
export type ReusedExecutorShape = {
  executor: ReusedExecutorShapeContents;
};
