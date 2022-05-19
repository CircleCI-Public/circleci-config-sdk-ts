import { Validator } from '../../../Config';
import {
  GenerableType,
  ParameterizedComponent,
} from '../../../Config/exports/Mapping';
import { CustomParametersList } from '../../Parameters';
import { parseParameterList } from '../../Parameters/parsers';
import { CommandParameterLiteral } from '../../Parameters/types/CustomParameterLiterals.types';
import { CustomCommand, ReusableCommand } from '../../Reusable';
import { Command } from '../exports/Command';
import { AddSSHKeys, AddSSHKeysParameters } from '../exports/Native/AddSSHKeys';
import { Restore, Save } from '../exports/Native/Cache';
import { RestoreCacheParameters } from '../exports/Native/Cache/Restore';
import { SaveCacheParameters } from '../exports/Native/Cache/Save';
import { Checkout, CheckoutParameters } from '../exports/Native/Checkout';
import { Run, RunParameters } from '../exports/Native/Run';
import {
  SetupRemoteDocker,
  SetupRemoteDockerParameters,
} from '../exports/Native/SetupRemoteDocker';
import {
  StoreArtifacts,
  StoreArtifactsParameters,
} from '../exports/Native/StoreArtifacts';
import {
  StoreTestResults,
  StoreTestResultsParameters,
} from '../exports/Native/StoreTestResults';
import { Attach, Persist } from '../exports/Native/Workspace';
import { AttachParameters } from '../exports/Native/Workspace/Attach';
import { PersistParameters } from '../exports/Native/Workspace/Persist';
import {
  CommandParameters,
  CustomCommandBodyShape,
  NativeCommandLiteral,
} from '../types/Command.types';

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

/**
 * Parses a list of steps into a list of commands.
 * @param stepsListIn - The steps from a job or custom command.
 * @param commands - The custom command list to refer to when a step is a reusable command.
 * @returns A list of parsed commands.
 */
export function parseSteps(
  stepsListIn: { [key: string]: unknown }[],
  commands?: CustomCommand[],
): Command[] {
  return stepsListIn.map((subtype) => {
    const commandName = Object.keys(subtype)[0];

    return parseStep(commandName, subtype[commandName], commands);
  });
}

/**
 * Parse an unknown step into a native or reusable command.
 * If the step name is a not a native command, the
 * @param name - The name of the command.
 * @param args - The arguments to the command.
 * @param commands - Only required when parsing reusable commands
 * @returns Command or ReusableCommand
 */
export function parseStep(
  name: string,
  args?: unknown,
  commands?: CustomCommand[],
): Command {
  let parsedCommand;

  if (name in nativeSubtypes) {
    parsedCommand = nativeSubtypes[name as NativeCommandLiteral](args);
  } else if (commands) {
    const command = commands.find((c) => c.name === name);

    if (!command) {
      throw new Error(
        `Failed to parse - Custom command ${name} not found in provided config.`,
      );
    }

    parsedCommand = new ReusableCommand(command, args as CommandParameters);
  }

  if (parsedCommand) {
    return parsedCommand;
  }

  throw new Error(`Failed to parse - Unknown native command: ${name}.
  `);
}

/**
 * Parse a config's list of custom commands, to later be referenced by ReusableCommands.
 * @param commandListIn - The list of custom commands to parse.
 * @param custom_commands - The custom commands to parse.
 * @returns A list of custom commands.
 */
export function parseCustomCommands(
  commandListIn: { [key: string]: unknown },
  custom_commands?: CustomCommand[],
): CustomCommand[] {
  return Object.entries(commandListIn).map(([name, args]) =>
    parseCustomCommand(name, args, custom_commands),
  );
}

/**
 * Parse a single custom command.
 * @param name - The name of the command.
 * @param args - The arguments of the command.
 * @param custom_commands - A reference list of custom commands to use for nested custom commands.
 * @returns A custom command.
 * @throws Error if the custom command is not valid.
 */
export function parseCustomCommand(
  name: string,
  args: unknown,
  custom_commands?: CustomCommand[],
): CustomCommand {
  if (!Validator.validateGenerable(GenerableType.CUSTOM_COMMAND, args)) {
    throw new Error(`Failed to validate custom command before parsing.`);
  }

  const command_args = args as CustomCommandBodyShape;

  const parametersList =
    command_args.parameters &&
    (parseParameterList(
      command_args.parameters,
      ParameterizedComponent.COMMAND,
    ) as CustomParametersList<CommandParameterLiteral>);

  const steps = parseSteps(command_args.steps, custom_commands);

  return new CustomCommand(
    name,
    steps,
    parametersList,
    command_args.description,
  );
}
