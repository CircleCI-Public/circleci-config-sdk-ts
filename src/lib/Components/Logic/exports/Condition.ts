import { Generable } from '../..';
import { GenerableType } from '../../../Config/exports/Mapping';
import { AnyConditionShape } from '../types';
import { Evaluable } from './Evaluable';

export abstract class Condition implements Generable, Evaluable<boolean> {
  abstract evaluate(): boolean;
  abstract generate(ctx?: GenerableType): AnyConditionShape;
  abstract get generableType(): GenerableType;
}
