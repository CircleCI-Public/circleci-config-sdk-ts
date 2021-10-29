import { Component } from '../index';
import {
  AnyParameterTypes,
  PrimitiveParameterTypes,
} from '../Parameters/Parameters.types';

/**
 * Abstract - A generic Command
 */
export abstract class Command extends Component {
  name: string;
  abstract parameters?: CommandParameters<AnyParameterTypes>;
  constructor(name: string) {
    super();
    this.name = name;
  }
  abstract generate(): CommandSchema;
}
/**
 * Parameter definitions for the command.
 */
export interface CommandParameters<ParameterType = AnyParameterTypes> {
  /**
   * Title of the step to be shown in the CircleCI UI (default: full command)
   */
  name?: string;
  [key: string]: ParameterType | PrimitiveParameterTypes | undefined;
}

export type CommandSchema = Record<
  string,
  CommandParameters<AnyParameterTypes>
>;
