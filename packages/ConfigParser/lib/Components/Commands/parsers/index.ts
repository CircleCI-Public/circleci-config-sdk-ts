import * as CircleCI from '@circleci/circleci-config-sdk';

import { parseGenerable, errorParsing } from '../../../Config/exports/Parsing';
import { parseParameterList } from '../../Parameters/parsers';

const nativeSubtypes: CircleCI.types.command.CommandSubtypeMap = {
  restore_cache: {
    generableType: CircleCI.mapping.GenerableType.RESTORE,
    parse: (args) =>
      new CircleCI.commands.cache.Restore(
        args as CircleCI.commands.cache.RestoreCacheParameters,
      ),
  },
  save_cache: {
    generableType: CircleCI.mapping.GenerableType.SAVE,
    parse: (args) =>
      new CircleCI.commands.cache.Save(
        args as CircleCI.commands.cache.SaveCacheParameters,
      ),
  },
  attach_workspace: {
    generableType: CircleCI.mapping.GenerableType.ATTACH,
    parse: (args) =>
      new CircleCI.commands.workspace.Attach(
        args as CircleCI.commands.workspace.AttachParameters,
      ),
  },
  persist_to_workspace: {
    generableType: CircleCI.mapping.GenerableType.PERSIST,
    parse: (args) =>
      new CircleCI.commands.workspace.Persist(
        args as CircleCI.commands.workspace.PersistParameters,
      ),
  },
  add_ssh_keys: {
    generableType: CircleCI.mapping.GenerableType.ADD_SSH_KEYS,
    parse: (args) =>
      new CircleCI.commands.AddSSHKeys(
        args as CircleCI.commands.AddSSHKeysParameters,
      ),
  },
  checkout: {
    generableType: CircleCI.mapping.GenerableType.CHECKOUT,
    parse: (args) =>
      new CircleCI.commands.Checkout(
        args as CircleCI.commands.CheckoutParameters,
      ),
  },
  run: {
    generableType: CircleCI.mapping.GenerableType.RUN,
    parse: (args) => {
      if (typeof args === 'string') {
        return new CircleCI.commands.Run({ command: args as string });
      }

      return new CircleCI.commands.Run(args as CircleCI.commands.RunParameters);
    },
  },
  setup_remote_docker: {
    generableType: CircleCI.mapping.GenerableType.SETUP_REMOTE_DOCKER,
    parse: (args) =>
      new CircleCI.commands.SetupRemoteDocker(
        args as CircleCI.commands.SetupRemoteDockerParameters,
      ),
  },
  store_artifacts: {
    generableType: CircleCI.mapping.GenerableType.STORE_ARTIFACTS,
    parse: (args) =>
      new CircleCI.commands.StoreArtifacts(
        args as CircleCI.commands.StoreArtifactsParameters,
      ),
  },
  store_test_results: {
    generableType: CircleCI.mapping.GenerableType.STORE_TEST_RESULTS,
    parse: (args) =>
      new CircleCI.commands.StoreTestResults(
        args as CircleCI.commands.StoreTestResultsParameters,
      ),
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
  commands?: CircleCI.reusable.ReusableCommand[],
): CircleCI.types.command.Command[] {
  return parseGenerable<
    Record<string, unknown>[],
    CircleCI.types.command.Command[],
    { steps: CircleCI.types.command.Command[] }
  >(
    CircleCI.mapping.GenerableType.STEP_LIST,
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
 * @returns Command or ReusedCommand
 */
export function parseStep(
  name: string,
  args?: unknown,
  commands?: CircleCI.reusable.ReusableCommand[],
): CircleCI.types.command.Command {
  if (name in nativeSubtypes) {
    const commandMapping =
      nativeSubtypes[name as CircleCI.types.command.NativeCommandLiteral];

    return parseGenerable<
      CircleCI.types.command.CommandParameters | undefined,
      CircleCI.types.command.Command
    >(commandMapping.generableType, args, commandMapping.parse);
  }

  if (commands !== undefined) {
    return parseGenerable<
      CircleCI.types.command.CommandParameters,
      CircleCI.reusable.ReusedCommand
    >(
      CircleCI.mapping.GenerableType.REUSED_COMMAND,
      args,
      (parameterArgs) => {
        const command = commands.find((c) => c.name === name);

        if (!command) {
          throw errorParsing(
            `Custom Command ${name} not found in command list.`,
          );
        }

        return new CircleCI.reusable.ReusedCommand(command, parameterArgs);
      },
      undefined,
      name,
    );
  }

  throw errorParsing(`Unknown native command: ${name}`);
}

/**
 * Parse a config's list of custom commands, to later be referenced by ReusedCommands.
 * @param commandListIn - The list of custom commands to parse.ReusableCommand
 * @param custom_commands - The custom commands to parse.
 * @returns A list of custom commands.
 */
export function parseReusableCommands(
  commandListIn: { [key: string]: unknown },
  custom_commands?: CircleCI.reusable.ReusableCommand[],
): CircleCI.reusable.ReusableCommand[] {
  return Object.entries(commandListIn).map(([name, args]) =>
    parseReusableCommand(name, args, custom_commands),
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
export function parseReusableCommand(
  name: string,
  args: unknown,
  custom_commands?: CircleCI.reusable.ReusableCommand[],
): CircleCI.reusable.ReusableCommand {
  return parseGenerable<
    CircleCI.types.command.ReusableCommandBodyShape,
    CircleCI.reusable.ReusableCommand,
    CircleCI.types.command.ReusableCommandDependencies
  >(
    CircleCI.mapping.GenerableType.REUSABLE_COMMAND,
    args,
    (commandArgs, { parametersList, steps }) => {
      return new CircleCI.reusable.ReusableCommand(
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
          CircleCI.mapping.ParameterizedComponent.COMMAND,
        ) as CircleCI.parameters.CustomParametersList<CircleCI.types.parameter.literals.CommandParameterLiteral>);

      const steps = parseSteps(commandArgs.steps, custom_commands);

      return { parametersList, steps };
    },
    name,
  );
}
