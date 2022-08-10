import { And, Equal, Not, Or } from './exports/conditions';
import { ConditionOrValue, ConditionValue } from './types';

export function and(...conditions: ConditionOrValue[]): And {
  return new And(conditions);
}

export function or(...conditions: ConditionOrValue[]): Or {
  return new Or(conditions);
}

export function equal(...values: ConditionValue[]): Equal {
  return new Equal(values);
}

export function not(condition: ConditionOrValue): Not {
  return new Not(condition);
}

/**
 * Conditional classes and utility functions
 */
export * as conditional from './exports/conditions';

export { When } from './exports/When';
