import {
  AddSSHKeys,
  Checkout,
  Run,
  SetupRemoteDocker,
  StoreArtifacts,
  StoreTestResults,
} from '@circleci/circleci-config-sdk/lib/Components/Commands';
import { Command } from '@circleci/circleci-config-sdk/lib/Components/Commands/exports/Command';
import { AddSSHKeysParameters } from '@circleci/circleci-config-sdk/lib/Components/Commands/exports/Native/AddSSHKeys';
import {
  Restore,
  Save,
} from '@circleci/circleci-config-sdk/lib/Components/Commands/exports/Native/Cache';
import { RestoreCacheParameters } from '@circleci/circleci-config-sdk/lib/Components/Commands/exports/Native/Cache/Restore';
import { SaveCacheParameters } from '@circleci/circleci-config-sdk/lib/Components/Commands/exports/Native/Cache/Save';
import { CheckoutParameters } from '@circleci/circleci-config-sdk/lib/Components/Commands/exports/Native/Checkout';
import { RunParameters } from '@circleci/circleci-config-sdk/lib/Components/Commands/exports/Native/Run';
import { SetupRemoteDockerParameters } from '@circleci/circleci-config-sdk/lib/Components/Commands/exports/Native/SetupRemoteDocker';
import { StoreArtifactsParameters } from '@circleci/circleci-config-sdk/lib/Components/Commands/exports/Native/StoreArtifacts';
import { StoreTestResultsParameters } from '@circleci/circleci-config-sdk/lib/Components/Commands/exports/Native/StoreTestResults';
import {
  Attach,
  Persist,
} from '@circleci/circleci-config-sdk/lib/Components/Commands/exports/Native/Workspace';
import { AttachParameters } from '@circleci/circleci-config-sdk/lib/Components/Commands/exports/Native/Workspace/Attach';
import { PersistParameters } from '@circleci/circleci-config-sdk/lib/Components/Commands/exports/Native/Workspace/Persist';
import {
  CommandSubtypeMap,
  NativeCommandLiteral,
  CommandParameters,
  CustomCommandBodyShape,
  CustomCommandDependencies,
} from '@circleci/circleci-config-sdk/lib/Components/Commands/types/Command.types';
import { CustomParametersList } from '@circleci/circleci-config-sdk/lib/Components/Parameters';
import { CommandParameterLiteral } from '@circleci/circleci-config-sdk/lib/Components/Parameters/types/CustomParameterLiterals.types';
import {
  CustomCommand,
  ReusableCommand,
} from '@circleci/circleci-config-sdk/lib/Components/Reusable';
import {
  GenerableType,
  ParameterizedComponent,
} from '@circleci/circleci-config-sdk/lib/Config/exports/Mapping';
import { parseGenerable, errorParsing } from '../../../Config/exports/Parsing';
import { parseParameterList } from '../../Parameters/parsers';

const nativeSubtypes: CommandSubtypeMap = {
  restore_cache: {
    generableType: GenerableType.RESTORE,
    parse: (args) => new Restore(args as RestoreCacheParameters),
  },
  save_cache: {
    generableType: GenerableType.SAVE,
    parse: (args) => new Save(args as SaveCacheParameters),
  },
  attach_workspace: {
    generableType: GenerableType.ATTACH,
    parse: (args) => new Attach(args as AttachParameters),
  },
  persist_to_workspace: {
    generableType: GenerableType.PERSIST,
    parse: (args) => new Persist(args as PersistParameters),
  },
  add_ssh_keys: {
    generableType: GenerableType.ADD_SSH_KEYS,
    parse: (args) => new AddSSHKeys(args as AddSSHKeysParameters),
  },
  checkout: {
    generableType: GenerableType.CHECKOUT,
    parse: (args) => new Checkout(args as CheckoutParameters),
  },
  run: {
    generableType: GenerableType.RUN,
    parse: (args) => {
      if (typeof args === 'string') {
        return new Run({ command: args as string });
      }

      return new Run(args as RunParameters);
    },
  },
  setup_remote_docker: {
    generableType: GenerableType.SETUP_REMOTE_DOCKER,
    parse: (args) => new SetupRemoteDocker(args as SetupRemoteDockerParameters),
  },
  store_artifacts: {
    generableType: GenerableType.STORE_ARTIFACTS,
    parse: (args) => new StoreArtifacts(args as StoreArtifactsParameters),
  },
  store_test_results: {
    generableType: GenerableType.STORE_TEST_RESULTS,
    parse: (args) => new StoreTestResults(args as StoreTestResultsParameters),
  },
};

/**
 * Parses a list of steps into a list of commands.
 * @param stepsListIn - The steps from a job or custom command.
 * @param commands - The custom command list to refer to when a step is a reusable command.
 * @returns A list of parsed commands.
 */
export function parseSteps(
  stepsListIn: unknown,
  commands?: CustomCommand[],
): Command[] {
  return parseGenerable<
    Record<string, unknown>[],
    Command[],
    { steps: Command[] }
  >(
    GenerableType.STEP_LIST,
    stepsListIn,
    (_, { steps }) => steps,
    (stepsListIn) => {
      return {
        steps: stepsListIn.map((subtype) => {
          if (typeof subtype === 'string') {
            return parseStep(subtype, undefined, commands);
          }

          const commandName = Object.keys(subtype)[0];

          return parseStep(commandName, subtype[commandName], commands);
        }),
      };
    },
  );
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
  if (name in nativeSubtypes) {
    const commandMapping = nativeSubtypes[name as NativeCommandLiteral];

    return parseGenerable<CommandParameters | undefined, Command>(
      commandMapping.generableType,
      args,
      commandMapping.parse,
    );
  }

  if (commands) {
    return parseGenerable<CommandParameters, ReusableCommand>(
      GenerableType.REUSABLE_COMMAND,
      args,
      (parameterArgs) => {
        const command = commands.find((c) => c.name === name);

        if (!command) {
          throw errorParsing(
            `Custom Command ${name} not found in command list.`,
          );
        }

        return new ReusableCommand(command, parameterArgs);
      },
      undefined,
      name,
    );
  }

  throw errorParsing(`Unknown native command: ${name}`);
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
  return parseGenerable<
    CustomCommandBodyShape,
    CustomCommand,
    CustomCommandDependencies
  >(
    GenerableType.CUSTOM_COMMAND,
    args,
    (commandArgs, { parametersList, steps }) => {
      return new CustomCommand(
        name,
        steps,
        parametersList,
        commandArgs.description,
      );
    },
    (commandArgs) => {
      const parametersList =
        commandArgs.parameters &&
        (parseParameterList(
          commandArgs.parameters,
          ParameterizedComponent.COMMAND,
        ) as CustomParametersList<CommandParameterLiteral>);

      const steps = parseSteps(commandArgs.steps, custom_commands);

      return { parametersList, steps };
    },
    name,
  );
}
