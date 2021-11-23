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
export type JobParameterTypes = Extract<
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
  | EnumParameter
  | StringParameter
  | IntegerParameter
  | BooleanParameter
  | StepsParameter
  | EnvironmentVariableNameParameter
  | EnvironmentParameter
  | ListParameter
>;

/**
 * Available parameter types for Executors
 */
export type ExecutorParameterTypes = Extract<
  AnyParameterType,
  EnumParameter | StringParameter | IntegerParameter | EnvironmentParameter
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
