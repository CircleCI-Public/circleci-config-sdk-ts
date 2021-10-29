import { Command } from '../Commands/Command';
import { AbstractExecutor } from '../Executor/Executor';

/**
 * String literal representing the type associated with a parameter. This value is written to YAML directly.
 */
export type AnyParameterLiteral =
  | 'string'
  | 'boolean'
  | 'integer'
  | 'environment'
  | 'enum'
  | 'executor'
  | 'steps';

export type ParameterizedJobParameterLiteral = Exclude<
  AnyParameterLiteral,
  'environment'
>;

export type ReusableCommandParameterLiteral = Exclude<
  AnyParameterLiteral,
  'executor' | 'environment'
>;

export type PipelineParameterLiteral = Exclude<
  AnyParameterLiteral,
  'executor' | 'environment' | 'steps'
>;

/**
 * Parameter type for a string which is restricted to a known list
 */
export type EnumParameter = string[];
/**
 * Parameter type for basic strings
 */
export type StringParameter = string;
/**
 * Parameter type for setting boolean conditionals
 */
export type BooleanParameter = boolean;
/**
 * Parameter type for numerical data
 */
export type IntegerParameter = number;
/**
 * Parameter type for a string that must match a POSIX_NAME regexp (for example, there can be no spaces or special characters).
 */
export type EnvironmentVariableNameParameter = string;
/**
 * Parameter type for steps, a list of steps that may be passed to a job or command.
 */
export type StepsParameter = Command[];
/**
 * Parameter type for Executors. Available for Parameterizable jobs.
 */
export type ExecutorParameter = AbstractExecutor;
/**
 * Parameter type for a map of environment variables. Can only be set on non-parameterizable jobs.
 */
export type EnvironmentParameter = Map<string, string>;

/**
 * All possible Parameter types across CircleCI. Used as an "abstract" type. Use the appropriate ParameterType for your component.
 */
export type AbstractParameterType =
  | EnumParameter
  | StringParameter
  | BooleanParameter
  | IntegerParameter
  | StepsParameter
  | ExecutorParameter
  | EnvironmentParameter;

export type ReusableJobParameterTypes = Exclude<
  AbstractParameterType,
  EnvironmentParameter
>;

export type ReusableCommandParameterType = Exclude<
  AbstractParameterType,
  EnvironmentParameter | ExecutorParameter
>;

export type PipelineParameterType = Exclude<
  AbstractParameterType,
  EnvironmentParameter | ExecutorParameter | StepsParameter
>;

export interface ParameterSchema<
  T = NonNullable<Exclude<AbstractParameterType, EnvironmentParameter>>,
> {
  type: AnyParameterLiteral;
  description?: string;
  default: T;
  enum?: string[]; // Enum must be set if 'type' is of "enum", otherwise set to null
}

export interface ParameterValues<ParameterTypeLiteral> {
  type: ParameterTypeLiteral;
  description?: string;
  defaultValue?: unknown;
  enumValues?: string[];
}
