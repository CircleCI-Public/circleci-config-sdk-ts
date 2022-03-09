import {
  CommandParameterTypes,
  ComponentParameter,
} from '../../Parameters/types/ComponentParameters.types';
import { CustomParametersListShape } from '../../Parameters/types/Parameters.types';

export type CommandType<T> = Extract<string | number, T>;

/**
 * Parameter definitions for the command.
 */
export type CommandParameters = ComponentParameter<CommandParameterTypes>;

export type CommandShape = Record<string, CommandParameters>;

export type CustomCommandBodyShape = {
  parameters?: CustomParametersListShape;
  steps: CommandShape[];
  description?: string;
};

export type CustomCommandShape = {
  [name: string]: CustomCommandBodyShape;
};

/**
 * The valid native commands found on an step object
 */
export type NativeCommandLiteral =
  | 'restore'
  | 'save'
  | 'attach'
  | 'persist'
  | 'add_ssh_keys'
  | 'checkout'
  | 'run'
  | 'setup_remote_docker'
  | 'store_artifacts'
  | 'store_test_results';
