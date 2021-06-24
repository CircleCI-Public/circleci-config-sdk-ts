import { ParameterTypes } from '../../Config/Parameters';
import Component from '../index';

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

export type CommandSchema = {
  [key: string]: CommandParameters;
};
