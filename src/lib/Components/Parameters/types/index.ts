import { Command } from '../../Commands/exports/Command';
import { Executor } from '../../Executors/exports/Executor';
import {
  AnyParameterLiteral,
  EnumParameterLiteral,
} from './CustomParameterLiterals.types';
import * as literals from './CustomParameterLiterals.types';
import * as components from './ComponentParameters.types';
// CircleCI Parameter Types

/**
 * All possible Parameter types across CircleCI. Used as an "abstract" type. Use the appropriate ParameterType for your component.
 */
export type AnyParameterType =
  | EnumParameter
  | StringParameter
  | BooleanParameter
  | IntegerParameter
  | StepsParameter
  | ExecutorParameter
  | EnvironmentParameter
  | MatrixParameter
  | FilterParameter;

export interface ParameterValues<
  ParameterTypeLiteral extends AnyParameterLiteral,
> {
  type: ParameterTypeLiteral;
  description?: StringParameter;
  defaultValue?: unknown;
  enumValues?: EnumParameter;
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
export type ExecutorParameter = Executor;
/**
 * Parameter type for a map of environment variables. Can only be set on non-parameterizable jobs.
 */
export type EnvironmentParameter = Record<string, string>;

export type FilterParameter = {
  /**
   * A map defining rules for execution on specific branches
   */
  branches?: {
    /**
     * Either a single branch specifier, or a list of branch specifiers
     */
    only?: ListParameter;
    /**
     * Either a single branch specifier, or a list of branch specifiers
     */
    ignore?: ListParameter;
  };
  /**
   * A map defining rules for execution on specific tags
   */
  tags?: {
    /**
     * Either a single tag specifier, or a list of tag specifiers
     */
    only?: ListParameter;
    /**
     * Either a single tag specifier, or a list of tag specifiers
     */
    ignore?: ListParameter;
  };
};

export type MatrixParameter = Record<string, ListParameter>;

export interface ParameterShape<
  T = NonNullable<Exclude<AnyParameterType, EnvironmentParameter>>,
> {
  type: AnyParameterLiteral;
  description?: StringParameter;
  default: T;
  enum?: ListParameter; // Enum must be set if 'type' is of "enum", otherwise set to null
}

export type CustomParametersListShape = Record<string, ParameterShape>;

export type CustomParameterShape<ParameterTypeLiteral> = {
  [key: string]: CustomParameterContentsShape<ParameterTypeLiteral>;
};

export type CustomParameterContentsShape<ParameterTypeLiteral> = {
  type: ParameterTypeLiteral;
  default: unknown;
  description?: string;
};

export type CustomEnumParameterContentsShape =
  | CustomParameterContentsShape<EnumParameterLiteral> & {
      enum: string[];
    };

export type CustomEnumParameterShape = {
  [key: string]: CustomEnumParameterContentsShape;
};

export { components, literals };
