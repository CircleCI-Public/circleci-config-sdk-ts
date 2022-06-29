import { Generable } from '../..';
import { GenerableType } from '../../../Config/exports/Mapping';
import { AnyConditionShape } from '../types';
import { Condition } from './Condition';

/**
 * 2.1 Conditional logic class component.
 */
export class When implements Generable {
  condition: Condition;

  constructor(condition: Condition) {
    this.condition = condition;
  }

  generate(): AnyConditionShape {
    return this.condition.generate();
  }

  get generableType(): GenerableType {
    return GenerableType.WHEN;
  }
}
