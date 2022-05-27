import { identityOrTruthy } from '.';
import { GenerableType } from '../../../../Config/exports/Mapping';
import { ConditionOrValue, NotConditionShape } from '../../types';
import { Condition } from '../Condition';

export class Not extends Condition {
  condition: Condition;

  constructor(condition: ConditionOrValue) {
    super();
    this.condition = identityOrTruthy(condition);
  }

  evaluate(): boolean {
    return !this.condition.evaluate();
  }

  generate(): NotConditionShape {
    return { not: this.condition.generate(this.generableType) };
  }

  get generableType(): GenerableType {
    return GenerableType.NOT;
  }
}
