import { CustomParametersList } from '..';
import { Generable } from '../..';
import { Config } from '../../../Config';
import { AnyParameterLiteral } from '../types/CustomParameterLiterals.types';

/**
 * Interface implemented on components to enforce parameter functionality.
 * {@label STATIC_2.1}
 */
export interface Parameterized<
  ParameterTypeLiteral extends AnyParameterLiteral,
> {
  name?: string;
  parameters?: CustomParametersList<ParameterTypeLiteral>;

  defineParameter(
    name: string,
    type: ParameterTypeLiteral,
    defaultValue?: unknown,
    description?: string,
    enumValues?: string[],
  ): Generable | Config;
}
