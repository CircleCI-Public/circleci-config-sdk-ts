import { ParameterTypes } from '../../Config/index.types';
import Component from '../index.types';
import { RunCommandSchema } from './Native/Run';

/**
 * Abstract - A generic Command
 */
export abstract class Command extends Component {
  name: string;
  abstract parameters?: CommandParameters;
  constructor(name: string) {
    super();
    this.name = name;
  }
}

export interface CommandParameters {
  /**
   * Title of the step to be shown in the CircleCI UI (default: full command)
   */
  name?: string;
  [key: string]: ParameterTypes;
}

export type CommandSchema = RunCommandSchema;
