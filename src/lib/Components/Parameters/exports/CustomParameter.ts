import { Generable } from '../..';
import { GenerableType } from '../../../Config/exports/Mapping';
import { Command } from '../../Commands/types/Command.types';
import { ReusedExecutor } from '../../Reusable';
import { CustomParameterContentsShape, CustomParameterShape } from '../types';
import { AnyParameterLiteral } from '../types/CustomParameterLiterals.types';

/**
 * Accepted parameters can be assigned to a component.
 * This is the type definition of the parameter, and does not store the value.
 * Components which accept parameters will have a {@link defineParameter} implementation.
 *
 * @param name - The name of the parameter.
 * @param type - The type of the parameter.
 * If using an enum, use the {@link CustomEnumParameter} class.
 * @param defaultValue - The default value of the parameter.
 * @param description - A description of the parameter.
 *
 */
export class CustomParameter<ParameterTypeLiteral extends AnyParameterLiteral>
  implements Generable
{
  name: string;
  type: ParameterTypeLiteral;
  defaultValue?: unknown;
  description?: string;

  constructor(
    name: string,
    type: ParameterTypeLiteral,
    defaultValue?: unknown,
    description?: string,
  ) {
    this.name = name;
    this.type = type;
    this.defaultValue = defaultValue;
    this.description = description;
  }

  generate(): CustomParameterShape<ParameterTypeLiteral> {
    return {
      [this.name]: this.generateContents(),
    };
  }

  generateContents(): CustomParameterContentsShape<ParameterTypeLiteral> {
    let defaultValue = this.defaultValue;

    if (this.type === 'executor' && defaultValue instanceof ReusedExecutor) {
      defaultValue = (this.defaultValue as ReusedExecutor)?.generateContents();
    } else if (this.type === 'steps' && Array.isArray(defaultValue)) {
      defaultValue = (this.defaultValue as Command[]).map((step) =>
        step.generate(),
      );
    }

    return {
      type: this.type,
      default: defaultValue,
      description: this.description,
    };
  }

  get generableType(): GenerableType {
    return GenerableType.CUSTOM_PARAMETER;
  }
}
