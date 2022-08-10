import { identityOrTruthy } from '.';
import { GenerableType } from '../../../../Config/exports/Mapping';
import { AndConditionShape, ConditionOrValue } from '../../types';
import { Condition } from '../Condition';

/**
 *  True if all arguments are truthy.
 *  @see {@link https://circleci.com/docs/configuration-reference#logic-statements}
 */
export class And extends Condition {
  conditions: Condition[];

  constructor(conditions: ConditionOrValue[]) {
    super();
    this.conditions = conditions.map(identityOrTruthy);
  }

  evaluate(): boolean {
    return this.conditions.every((c) => c.evaluate());
  }

  generate(): AndConditionShape {
    return { and: this.conditions.map((c) => c.generate()) };
  }

  get generableType(): GenerableType {
    return GenerableType.AND;
  }
}
