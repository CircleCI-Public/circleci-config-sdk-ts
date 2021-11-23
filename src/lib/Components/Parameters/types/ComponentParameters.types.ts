import {
  AnyParameterType,
  EnumParameter,
  StringParameter,
  BooleanParameter,
  IntegerParameter,
  EnvironmentParameter,
  EnvironmentVariableNameParameter,
  StepsParameter,
  ExecutorParameter,
  ListParameter,
  FilterParameter,
  MatrixParameter,
} from './Parameters.types';

/**
 * Available parameter types for Jobs
 */
export type WorkflowJobParameterTypes = Extract<
  AnyParameterType,
  | EnumParameter
  | StringParameter
  | BooleanParameter
  | IntegerParameter
  | EnvironmentVariableNameParameter
  | StepsParameter
  | ExecutorParameter
  | MatrixParameter
  | FilterParameter
>;

/**
 * Available parameter types for Commands
 */
export type CommandParameterTypes = Extract<
  AnyParameterType,
  | StringParameter
  | IntegerParameter
  | BooleanParameter
  | EnvironmentVariableNameParameter
  | StepsParameter
  | EnvironmentParameter
  | ListParameter
>;

/**
 * Available parameter types for Executors
 */
export type ExecutorParameterTypes = Extract<
  AnyParameterType,
  StringParameter | IntegerParameter | EnvironmentParameter
>;

/**
 * Available parameter types for Pipelines
 */
export type PipelineParametersType = Extract<
  AnyParameterType,
  StringParameter | IntegerParameter | BooleanParameter | EnumParameter
>;

/**
 * Interface for components parameters
 */
export interface ComponentParameter<ParameterType extends AnyParameterType> {
  [key: string]: ParameterType | undefined;
}
