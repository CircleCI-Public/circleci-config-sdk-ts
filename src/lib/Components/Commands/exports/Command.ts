import { Generable } from '../../index';
import { StringParameter } from '../../Parameters/types';
import { CommandParameters, CommandShape } from '../types/Command.types';

/**
 * Abstract - A generic Command
 */
export interface Command extends Generable {
  name: StringParameter;
  parameters?: CommandParameters;
  generate(): CommandShape;
}
