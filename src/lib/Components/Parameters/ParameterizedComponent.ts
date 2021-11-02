import { CustomParametersList } from '.';
import { Component } from '..';
import { AnyParameterLiteral } from './Parameters.types';

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
