import { Generable } from '../../index';
import { StringParameter } from '../../Parameters/types';
import {
  BodylessCommand,
  CommandParameters,
  CommandShape,
  CommandShorthandShape,
} from '../types/Command.types';

/**
 * Abstract - A generic Command
 */
export interface Command extends Generable {
  name: StringParameter;
  parameters?: CommandParameters;
  generate(
    flatten?: boolean,
  ): CommandShape | CommandShorthandShape | BodylessCommand;
}
