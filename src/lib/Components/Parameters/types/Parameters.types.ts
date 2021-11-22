import { Command } from '../../Commands/Command';
import { AbstractExecutor } from '../../Executor/Executor';
import { AnyParameterLiteral } from './CustomParameterLiterals.types';

// CircleCI Parameter Types

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

export interface ParameterValues<
  ParameterTypeLiteral extends AnyParameterLiteral,
> {
  type: ParameterTypeLiteral;
  description?: string;
  defaultValue?: unknown;
  enumValues?: string[];
}

/**
 * Parameter type for a string which is restricted to a known list
 */
export type EnumParameter = string[];
/**
 * Parameter type for a string array. Utilized by multiple CircleCI built-in components. Can not be used by custom components.
 */
export type ListParameter = string[];
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

export interface ParameterSchema<
  T = NonNullable<Exclude<AbstractParameterType, EnvironmentParameter>>,
> {
  type: AnyParameterLiteral;
  description?: string;
  default: T;
  enum?: string[]; // Enum must be set if 'type' is of "enum", otherwise set to null
}
