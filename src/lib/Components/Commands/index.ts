import { parameters } from '../../..';
import { Config } from '../../Config';
import { ConfigValidator } from '../../Config/ConfigValidator';
import {
  GenerableType,
  ParameterizedComponent,
} from '../../Config/types/Config.types';
import { CustomParametersList } from '../Parameters';
import { CommandParameterLiteral } from '../Parameters/types/CustomParameterLiterals.types';
import { Command } from './exports/Command';
import { AddSSHKeys, AddSSHKeysParameters } from './exports/Native/AddSSHKeys';
import { Restore, Save } from './exports/Native/Cache';
import { RestoreCacheParameters } from './exports/Native/Cache/Restore';
import { SaveCacheParameters } from './exports/Native/Cache/Save';
import { Checkout, CheckoutParameters } from './exports/Native/Checkout';
import { Run, RunParameters } from './exports/Native/Run';
import {
  SetupRemoteDocker,
  SetupRemoteDockerParameters,
} from './exports/Native/SetupRemoteDocker';
import {
  StoreArtifacts,
  StoreArtifactsParameters,
} from './exports/Native/StoreArtifacts';
import {
  StoreTestResults,
  StoreTestResultsParameters,
} from './exports/Native/StoreTestResults';
import { Attach, Persist } from './exports/Native/Workspace';
import { AttachParameters } from './exports/Native/Workspace/Attach';
import { PersistParameters } from './exports/Native/Workspace/Persist';
import { CustomCommand, ReusableCommand } from './exports/Reusable';
import {
  CommandParameters,
  CustomCommandBodyShape,
  NativeCommandLiteral,
} from './types/Command.types';

const nativeSubtypes: {
  [key in NativeCommandLiteral]: (args: unknown) => Command | undefined;
} = {
  restore_cache: (args) => {
    const restoreArgs = args as RestoreCacheParameters;

    if (ConfigValidator.validate(GenerableType.RESTORE, restoreArgs)) {
      return new Restore(args as RestoreCacheParameters);
    }
  },
  save_cache: (args) => {
    const saveArgs = args as SaveCacheParameters;

    if (ConfigValidator.validate(GenerableType.SAVE, saveArgs)) {
      return new Save(args as SaveCacheParameters);
    }
  },
  attach_workspace: (args) => {
    const attachArgs = args as AttachParameters;

    if (ConfigValidator.validate(GenerableType.ATTACH, attachArgs)) {
      return new Attach(args as AttachParameters);
    }
  },
  persist_workspace: (args) => {
    const persistArgs = args as PersistParameters;

    if (ConfigValidator.validate(GenerableType.PERSIST, persistArgs)) {
      return new Persist(args as PersistParameters);
    }
  },
  add_ssh_keys: (args) => {
    const addSSHKeysArgs = args as AddSSHKeysParameters;

    if (ConfigValidator.validate(GenerableType.ADD_SSH_KEYS, addSSHKeysArgs)) {
      return new AddSSHKeys(args as AddSSHKeysParameters);
    }
  },
  checkout: (args) => {
    const checkoutArgs = args as CheckoutParameters;

    if (ConfigValidator.validate(GenerableType.CHECKOUT, checkoutArgs)) {
      return new Checkout(args as CheckoutParameters);
    }
  },
  run: (args) => {
    const runArgs = args as RunParameters;

    if (ConfigValidator.validate(GenerableType.RUN, runArgs)) {
      return new Run(args as RunParameters);
    }
  },
  setup_remote_docker: (args) => {
    const setupRemoteDockerArgs = args as SetupRemoteDockerParameters;

    if (
      ConfigValidator.validate(
        GenerableType.SETUP_REMOTE_DOCKER,
        setupRemoteDockerArgs,
      )
    ) {
      return new SetupRemoteDocker(args as SetupRemoteDockerParameters);
    }
  },
  store_artifacts: (args) => {
    const storeArtifactsArgs = args as StoreArtifactsParameters;

    if (
      ConfigValidator.validate(
        GenerableType.STORE_ARTIFACTS,
        storeArtifactsArgs,
      )
    ) {
      return new StoreArtifacts(args as StoreArtifactsParameters);
    }
  },
  store_test_results: (args) => {
    const storeTestResultsArgs = args as StoreTestResultsParameters;

    if (
      ConfigValidator.validate(
        GenerableType.STORE_TEST_RESULTS,
        storeTestResultsArgs,
      )
    ) {
      return new StoreTestResults(args as StoreTestResultsParameters);
    }
  },
};

function parseSteps(
  commandIn: { [key: string]: unknown }[],
  config?: Config,
): Command[] {
  return commandIn.map((subtype) => {
    const commandName = Object.keys(subtype)[0];

    return parseCommand(commandName, subtype[commandName], config);
  });
}

function parseCommand(name: string, args?: unknown, config?: Config): Command {
  let parsedCommand;

  if (name in nativeSubtypes) {
    parsedCommand = nativeSubtypes[name as NativeCommandLiteral](args);
  } else if (config && config.commands) {
    const command = config.commands.find((c) => c.name === name);

    if (command) {
      parsedCommand = new ReusableCommand(command, args as CommandParameters);
    } else {
      throw new Error(
        `Failed to parse - Custom command ${name} not found in provided config.`,
      );
    }
  }

  if (parsedCommand) {
    return parsedCommand;
  }

  throw new Error(`Failed to parse - Unknown native command: ${name}.`);
}

function parseCustomCommand(
  name: string,
  args: unknown,
  config?: Config,
): CustomCommand {
  if (ConfigValidator.validate(GenerableType.CUSTOM_COMMAND, args)) {
    const command_args = args as CustomCommandBodyShape;

    const parametersList = command_args.parameters
      ? (parameters.parseLists(
          command_args.parameters,
          ParameterizedComponent.COMMAND,
        ) as CustomParametersList<CommandParameterLiteral>)
      : undefined;

    const steps = parseSteps(command_args.steps, config);

    return new CustomCommand(
      name,
      steps,
      parametersList,
      command_args.description,
    );
  }

  throw new Error(`Failed to parse custom command.`);
}

export * as cache from './exports/Native/Cache';
export * as workspace from './exports/Native/Workspace';
export * as reusable from './exports/Reusable';
export { AddSSHKeys };
export { Checkout };
export { Run };
export { SetupRemoteDocker };
export { StoreArtifacts };
export { StoreTestResults };
export { parseSteps, parseCommand, parseCustomCommand };
