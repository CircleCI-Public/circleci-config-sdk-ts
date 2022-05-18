import { GenerableType } from '../../Config/exports/Mapping';
import { Validator } from '../../Config/exports/Validator';
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
import { CommandParameters, NativeCommandLiteral } from './types/Command.types';

const nativeSubtypes: {
  [key in NativeCommandLiteral]: (args: unknown) => Command | undefined;
} = {
  restore_cache: (args) => {
    const restoreArgs = args as RestoreCacheParameters;

    if (Validator.validateGenerable(GenerableType.RESTORE, restoreArgs)) {
      return new Restore(args as RestoreCacheParameters);
    }
  },
  save_cache: (args) => {
    const saveArgs = args as SaveCacheParameters;

    if (Validator.validateGenerable(GenerableType.SAVE, saveArgs)) {
      return new Save(args as SaveCacheParameters);
    }
  },
  attach_workspace: (args) => {
    const attachArgs = args as AttachParameters;

    if (Validator.validateGenerable(GenerableType.ATTACH, attachArgs)) {
      return new Attach(args as AttachParameters);
    }
  },
  persist_workspace: (args) => {
    const persistArgs = args as PersistParameters;

    if (Validator.validateGenerable(GenerableType.PERSIST, persistArgs)) {
      return new Persist(args as PersistParameters);
    }
  },
  add_ssh_keys: (args) => {
    const addSSHKeysArgs = args as AddSSHKeysParameters;

    if (
      Validator.validateGenerable(GenerableType.ADD_SSH_KEYS, addSSHKeysArgs)
    ) {
      return new AddSSHKeys(args as AddSSHKeysParameters);
    }
  },
  checkout: (args) => {
    const checkoutArgs = args as CheckoutParameters;

    if (Validator.validateGenerable(GenerableType.CHECKOUT, checkoutArgs)) {
      return new Checkout(args as CheckoutParameters);
    }
  },
  run: (args) => {
    const runArgs = args as RunParameters;

    if (Validator.validateGenerable(GenerableType.RUN, runArgs)) {
      return new Run(args as RunParameters);
    }
  },
  setup_remote_docker: (args) => {
    const setupRemoteDockerArgs = args as SetupRemoteDockerParameters;

    if (
      Validator.validateGenerable(
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
      Validator.validateGenerable(
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
      Validator.validateGenerable(
        GenerableType.STORE_TEST_RESULTS,
        storeTestResultsArgs,
      )
    ) {
      return new StoreTestResults(args as StoreTestResultsParameters);
    }
  },
};

function parseSteps(
  commandListIn: { [key: string]: unknown }[],
  commands?: CustomCommand[],
): Command[] {
  return commandListIn.map((subtype) => {
    const commandName = Object.keys(subtype)[0];

    return parseStep(commandName, subtype[commandName], commands);
  });
}

/**
 * Parse a native or reusable command.
 * @param name - The name of the command.
 * @param args - The arguments to the command.
 * @returns Command or ReusableCommand
 */
function parseStep(
  name: string,
  args?: unknown,
  commands?: CustomCommand[],
): Command {
  let parsedCommand;

  if (name in nativeSubtypes) {
    parsedCommand = nativeSubtypes[name as NativeCommandLiteral](args);
  } else if (commands) {
    const command = commands.find((c) => c.name === name);

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

export * as cache from './exports/Native/Cache';
export * as workspace from './exports/Native/Workspace';
export * as reusable from './exports/Reusable';
export { AddSSHKeys };
export { Checkout };
export { Run };
export { SetupRemoteDocker };
export { StoreArtifacts };
export { StoreTestResults };
export { parseSteps, parseStep as parseCommand };
