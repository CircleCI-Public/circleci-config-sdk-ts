import { GenerableType } from '../../../../Config/exports/Mapping';
import { ConditionValue, EqualConditionShape } from '../../types';
import { Condition } from '../Condition';

/**
 * True if all arguments evaluate to equal values.
 * @see {@link https://circleci.com/docs/configuration-reference#logic-statements}
 */
export class Equal extends Condition {
  constructor(private values: ConditionValue[]) {
    super();
  }

  /**
   * Ensure each condition is equal
   * @returns whether all conditions are equal
   */
  evaluate(): boolean {
    const first = this.values[0];

    for (let i = 1; i < this.values.length; i++) {
      // intentionally not using strict equality.
      if (first != this.values[i]) {
        return false;
      }
    }

    return true;
  }

  generate(): EqualConditionShape {
    return {
      equal: this.values,
    };
  }

  get generableType(): GenerableType {
    return GenerableType.EQUAL;
  }
}
