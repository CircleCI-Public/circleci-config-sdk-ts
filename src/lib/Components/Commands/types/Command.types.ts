import {
  CommandParameterTypes,
  ComponentParameter,
} from '../../Parameters/types/ComponentParameters.types';
import { CustomParametersListShape } from '../../Parameters/types';
import { GenerableType } from '../../../Config/exports/Mapping';
import { Command } from '../exports/Command';
import { CustomParametersList } from '../../Parameters';
import { CommandParameterLiteral } from '../../Parameters/types/CustomParameterLiterals.types';

export type CommandType<T> = Extract<string | number, T>;

/**
 * Parameter definitions for the command.
 */
export type CommandParameters = ComponentParameter<CommandParameterTypes>;

export type CommandShape = Record<string, CommandParameters>;

export type BodylessCommand = string;

export type CommandShorthandShape = Record<string, string>;

export type AnyCommandShape =
  | CommandShape
  | CommandShorthandShape
  | BodylessCommand;

export type ReusableCommandBodyShape = {
  parameters?: CustomParametersListShape;
  steps: AnyCommandShape[];
  description?: string;
};

export type ReusableCommandShape = {
  [name: string]: ReusableCommandBodyShape;
};

/**
 * The valid native commands found on an step object
 */
export type NativeCommandLiteral =
  | 'restore_cache'
  | 'save_cache'
  | 'attach_workspace'
  | 'persist_to_workspace'
  | 'add_ssh_keys'
  | 'checkout'
  | 'run'
  | 'setup_remote_docker'
  | 'store_artifacts'
  | 'store_test_results';

export type CommandSubtypeMap = {
  [key in NativeCommandLiteral]: {
    generableType: GenerableType;
    parse: (args?: CommandParameters) => Command;
  };
};

export type ReusableCommandDependencies = {
  parametersList?: CustomParametersList<CommandParameterLiteral>;
  steps: Command[];
};

export { Command };
