import {
  AnyParameterType,
  CustomParametersListShape,
  StringParameter,
} from '../../Parameters/types';
import { ExecutableContentsShape, ExecutableShape } from './Executor.types';

/**
 * The shape output when a reusable executor is generated for a job
 */
export type ReusableExecutorJobRefShape = {
  executor: {
    name: StringParameter;
    [key: string]: AnyParameterType;
  };
};

export type ReusableExecutorContents = {
  parameters?: CustomParametersListShape;
} & ExecutableContentsShape;

export type ReusableExecutorShape = ExecutableShape<ReusableExecutorContents>;
