import { identityOrTruthy } from '.';
import { GenerableType } from '../../../../Config/exports/Mapping';
import { ConditionOrValue, NotConditionShape } from '../../types';
import { Condition } from '../Condition';

/**
 * True the argument is not truthy.
 * @see {@link https://circleci.com/docs/configuration-reference#logic-statements}
 */
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
    return { not: this.condition.generate() };
  }

  get generableType(): GenerableType {
    return GenerableType.NOT;
  }
}
