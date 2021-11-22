import { CustomParametersList } from '.';
import { Component } from '..';
import { AnyParameterLiteral } from './types/CustomParameterLiterals.types';

/**
 * Interface implemented on components to enforce parameter functionality.
 * {@label STATIC_2.1}
 */
export interface ParameterizedComponent<
  ParameterTypeLiteral extends AnyParameterLiteral,
> {
  parameters?: CustomParametersList<ParameterTypeLiteral>;

  defineParameter(
    name: string,
    type: ParameterTypeLiteral,
    defaultValue?: unknown,
    description?: string,
    enumValues?: string[],
  ): Component;
}
