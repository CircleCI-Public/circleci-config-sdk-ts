import { identityOrTruthy } from '.';
import { GenerableType } from '../../../../Config/exports/Mapping';
import { ConditionOrValue, OrConditionShape } from '../../types';
import { Condition } from '../Condition';

export class Or extends Condition {
  conditions: Condition[];

  constructor(conditions: ConditionOrValue[]) {
    super();
    this.conditions = conditions.map(identityOrTruthy);
  }

  evaluate(): boolean {
    for (const condition of this.conditions) {
      if (condition.evaluate()) {
        return true;
      }
    }

    return false;
  }

  generate(): OrConditionShape {
    return { or: this.conditions.map((c) => c.generate()) };
  }

  get generableType(): GenerableType {
    return GenerableType.OR;
  }
}
