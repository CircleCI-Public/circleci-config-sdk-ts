import {
  GenerableType,
  ParameterizedComponent,
} from '../../../Config/exports/Mapping';
import { errorParsing, parseGenerable } from '../../../Config/exports/Parsing';
import { OrbImport } from '../../../Orb';
import { parseOrbRef } from '../../../Orb/parsers';
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
  CommandSubtypeMap,
  CustomCommandBodyShape,
  CustomCommandDependencies,
  NativeCommandLiteral,
} from '../types/Command.types';

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
  orbs?: OrbImport[],
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
            return parseStep(subtype, undefined, commands, orbs);
          }

          const commandName = Object.keys(subtype)[0];

          return parseStep(commandName, subtype[commandName], commands, orbs);
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
  orbs?: OrbImport[],
): Command {
  if (name in nativeSubtypes) {
    const commandMapping = nativeSubtypes[name as NativeCommandLiteral];

    return parseGenerable<CommandParameters | undefined, Command>(
      commandMapping.generableType,
      args,
      commandMapping.parse,
    );
  }

  if (commands || orbs) {
    return parseGenerable<CommandParameters, ReusableCommand>(
      GenerableType.REUSABLE_COMMAND,
      args,
      (parameterArgs) => {
        const command =
          parseOrbRef<CommandParameterLiteral>(
            { [name]: args },
            'commands',
            orbs,
          ) || commands?.find((c) => c.name === name);

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
  orbs?: OrbImport[],
): CustomCommand[] {
  const parsed: CustomCommand[] = [];

  Object.entries(commandListIn).forEach(([name, args]) => {
    const command = parseCustomCommand(name, args, parsed, orbs);
    parsed.push(command);
  });

  return parsed;
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
  orbs?: OrbImport[],
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

      const steps = parseSteps(commandArgs.steps, custom_commands, orbs);

      return { parametersList, steps };
    },
    name,
  );
}
