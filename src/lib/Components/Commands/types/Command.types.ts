import {
  CommandParameterTypes,
  ComponentParameter,
} from '../../Parameters/types/ComponentParameters.types';

export type CommandType<T> = Extract<string | number, T>;

/**
 * Parameter definitions for the command.
 */
export type CommandParameters = ComponentParameter<CommandParameterTypes>;

export type CommandShape = Record<string, CommandParameters>;
