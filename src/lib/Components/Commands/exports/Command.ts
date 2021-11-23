import { Component } from '../../index';
import { StringParameter } from '../../Parameters/types/Parameters.types';
import { CommandParameters, CommandShape } from '../types/Command.types';

/**
 * Abstract - A generic Command
 */
export abstract class Command extends Component {
  name: StringParameter;
  abstract parameters?: CommandParameters;
  constructor(name: StringParameter) {
    super();
    this.name = name;
  }
  abstract generate(): CommandShape;
}
