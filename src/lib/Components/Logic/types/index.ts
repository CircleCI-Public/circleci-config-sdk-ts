import { Condition } from '../exports/Condition';

export type AndConditionShape = {
  and: AnyConditionShape[];
};

export type OrConditionShape = {
  or: AnyConditionShape[];
};
export type NotConditionShape = {
  not: AnyConditionShape;
};

export type EqualConditionShape = {
  equal: unknown[];
};

export type AnyConditionShape =
  | AndConditionShape
  | OrConditionShape
  | NotConditionShape
  | EqualConditionShape
  | unknown;

export type ConditionValue = string | boolean | number;
export type ConditionOrValue = Condition | ConditionValue;
