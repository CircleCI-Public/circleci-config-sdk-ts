import { Component } from '../index';
import { AbstractParameterType } from '../Parameters/types/Parameters.types';

/**
 * Abstract - A generic Command
 */
export abstract class Command extends Component {
  name: string;
  abstract parameters?: CommandParameters<AbstractParameterType>;
  constructor(name: string) {
    super();
    this.name = name;
  }
  abstract generate(): CommandSchema;
}

export type CommandType<T> = Extract<string | number, T>;

/**
 * Parameter definitions for the command.
 */
export interface CommandParameters<T = AbstractParameterType> {
  /**
   * Title of the step to be shown in the CircleCI UI (default: full command)
   */
  [key: string]: T | undefined;
}

export type CommandSchema = Record<
  string,
  CommandParameters<AbstractParameterType>
>;
