import { ParameterTypes } from '../../Config/Parameters';
import { Component } from '../index';

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
  abstract generate(): CommandSchema;
}
/**
 * Parameter definitions for the command.
 */
export interface CommandParameters {
  /**
   * Title of the step to be shown in the CircleCI UI (default: full command)
   */
  readonly name?: string;
  readonly [key: string]: ParameterTypes;
}

export type CommandSchema = Record<string, CommandParameters>;
