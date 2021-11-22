import {
  AbstractParameterType,
  EnumParameter,
  StringParameter,
  BooleanParameter,
  IntegerParameter,
  EnvironmentParameter,
  EnvironmentVariableNameParameter,
  StepsParameter,
  ExecutorParameter,
} from './Parameters.types';

/**
 * Available parameter types for Jobs
 */
export type JobParameterTypes = Extract<
  AbstractParameterType,
  | EnumParameter
  | StringParameter
  | BooleanParameter
  | IntegerParameter
  | EnvironmentVariableNameParameter
  | StepsParameter
  | ExecutorParameter
>;

/**
 * Available parameter types for Commands
 */
export type CommandParameterTypes = Extract<
  AbstractParameterType,
  | StringParameter
  | IntegerParameter
  | BooleanParameter
  | EnvironmentVariableNameParameter
  | StepsParameter
  | EnvironmentParameter
>;

/**
 * Available parameter types for Executors
 */
export type ExecutorParameterTypes = Extract<
  AbstractParameterType,
  StringParameter | IntegerParameter
>;

/**
 * Available parameter types for Pipelines
 */
export type PipelineParametersType = Extract<
  AbstractParameterType,
  StringParameter | IntegerParameter | BooleanParameter | EnumParameter
>;
