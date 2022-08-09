import { Executor } from '..';
import { CustomParametersList } from '../../Parameters';
import {
  StringParameter,
  AnyParameterType,
  CustomParametersListShape,
} from '../../Parameters/types';
import { ExecutorParameterLiteral } from '../../Parameters/types/CustomParameterLiterals.types';
import {
  ExecutorShape,
  UnknownExecutableShape,
  UnknownParameterized,
} from './Executor.types';

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

export type UnknownReusableExecutor = {
  [key: string]: UnknownExecutableShape & UnknownParameterized;
};

export type ReusableExecutorDependencies = {
  parametersList?: CustomParametersList<ExecutorParameterLiteral>;
  executor: Executor;
};
