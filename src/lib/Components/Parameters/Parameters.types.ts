import { Command } from '../Commands/Command';
import { AbstractExecutor } from '../Executor/Executor';

export type PrimitiveParameter = 'string' | 'integer' | 'boolean' | 'enum';
export type ExtendedParameter = 'executor' | 'environment' | 'steps';
export type AnyParameter = PrimitiveParameter | ExtendedParameter;

export type PrimitiveParameterTypes = string | number | boolean | string[];
export type ExtendedParameterTypes =
  | AbstractExecutor
  | Map<string, string>
  | Command[];
export type AnyParameterTypes =
  | PrimitiveParameterTypes
  | ExtendedParameterTypes
  | undefined;

export interface ParameterValues<ParameterType = AnyParameter> {
  type: ParameterType;
  defaultValue?: unknown;
  enumValues?: string[];
}
