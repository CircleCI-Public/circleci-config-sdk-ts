import Ajv, { SchemaObject } from 'ajv';
import AddSSHKeysSchema from '../Components/Commands/schema/Native/AddSSHKeys.schema';
import RestoreSchema from '../Components/Commands/schema/Native/Cache/Restore.schema';
import SaveSchema from '../Components/Commands/schema/Native/Cache/Save.schema';
import CheckoutSchema from '../Components/Commands/schema/Native/Checkout.schema';
import CommandSchema from '../Components/Commands/schema/Native/Command.schema';
import RunSchema from '../Components/Commands/schema/Native/Run.schema';
import SetupRemoteDockerSchema from '../Components/Commands/schema/Native/SetupRemoteDocker.schema';
import StoreArtifactsSchema from '../Components/Commands/schema/Native/StoreArtifacts.schema';
import StoreTestResultsSchema from '../Components/Commands/schema/Native/StoreTestResults.schema';
import AttachWorkspaceSchema from '../Components/Commands/schema/Native/Workspace/Attach.schema';
import PersistSchema from '../Components/Commands/schema/Native/Workspace/Persist.schema';
import DockerExecutorSchema from '../Components/Executor/schemas/DockerExecutor.schema';
import MachineExecutorSchema from '../Components/Executor/schemas/MachineExecutor.schema';
import MacOSExecutorSchema from '../Components/Executor/schemas/MacosExecutor.schema';
import ExecutorSchema from '../Components/Executor/schemas/ReusableExecutor.schema';
import WindowsExecutorSchema from '../Components/Executor/schemas/WindowsExecutor.schema';
import CommandParametersSchema from '../Components/Parameters/schemas/CommandParameters.schema';
import {
  CommandParameterListSchema,
  ExecutorParameterListSchema,
  JobParameterListSchema,
  PipelineParameterListSchema,
} from '../Components/Parameters/schemas/ComponentParameterLists.schema';
import ExecutorParametersSchema from '../Components/Parameters/schemas/ExecutorParameters.schema';
import JobParametersSchema from '../Components/Parameters/schemas/JobParameters.schema';
import {
  BooleanParameterSchema,
  EnumParameterSchema,
  EnvVarNameParameterSchema,
  ExecutorParameterSchema,
  IntegerParameterSchema,
  StepsParameterSchema,
  StringParameterSchema,
} from '../Components/Parameters/schemas/ParameterTypes.schema';
import PipelineParametersSchema from '../Components/Parameters/schemas/PipelineParameters.schema';
import {
  GenerableSubtypes,
  GenerableType,
  ParametersListSubtype,
  ParameterSubtype,
  ValidationMap,
  ValidationResult,
} from './types/Config.types';

const schemaRegistry: ValidationMap = {
  [GenerableType.REUSABLE_COMMAND]: {},
  [GenerableType.CUSTOM_COMMAND]: {},
  [GenerableType.RESTORE]: RestoreSchema,
  [GenerableType.SAVE]: SaveSchema,
  [GenerableType.ATTACH]: AttachWorkspaceSchema,
  [GenerableType.PERSIST]: PersistSchema,
  [GenerableType.ADD_SSH_KEYS]: AddSSHKeysSchema,
  [GenerableType.CHECKOUT]: CheckoutSchema,
  [GenerableType.RUN]: RunSchema,
  [GenerableType.SETUP_REMOTE_DOCKER]: SetupRemoteDockerSchema,
  [GenerableType.STORE_ARTIFACTS]: StoreArtifactsSchema,
  [GenerableType.STORE_TEST_RESULTS]: StoreTestResultsSchema,

  [GenerableType.DOCKER_EXECUTOR]: DockerExecutorSchema,
  [GenerableType.MACHINE_EXECUTOR]: MachineExecutorSchema,
  [GenerableType.MACOS_EXECUTOR]: MacOSExecutorSchema,
  [GenerableType.WINDOWS_EXECUTOR]: WindowsExecutorSchema,
  [GenerableType.REUSABLE_EXECUTOR]: ExecutorSchema,

  [GenerableType.STEP]: CommandSchema,
  [GenerableType.JOB]: {},
  [GenerableType.WORKFLOW_JOB]: {},

  [GenerableType.CUSTOM_PARAMETER]: {
    /* Custom Parameter Config Components */
    [ParameterSubtype.JOB_PARAMS]: JobParametersSchema,
    [ParameterSubtype.COMMAND_PARAMS]: CommandParametersSchema,
    [ParameterSubtype.EXECUTOR_PARAMS]: ExecutorParametersSchema,
    [ParameterSubtype.PIPELINE_PARAMS]: PipelineParametersSchema,
    /** Custom Parameter Types */
    [ParameterSubtype.STRING]: StringParameterSchema,
    [ParameterSubtype.BOOLEAN]: BooleanParameterSchema,
    [ParameterSubtype.INTEGER]: IntegerParameterSchema,
    [ParameterSubtype.EXECUTOR]: ExecutorParameterSchema,
    [ParameterSubtype.STEPS]: StepsParameterSchema,
    [ParameterSubtype.ENV_VAR_NAME]: EnvVarNameParameterSchema,
  },
  [GenerableType.CUSTOM_ENUM_PARAMETER]: EnumParameterSchema,
  [GenerableType.CUSTOM_PARAMETERS_LIST]: {
    [ParametersListSubtype.JOB]: JobParameterListSchema,
    [ParametersListSubtype.COMMAND]: CommandParameterListSchema,
    [ParametersListSubtype.EXECUTOR]: ExecutorParameterListSchema,
    [ParametersListSubtype.PIPELINE]: PipelineParameterListSchema,
  },
};

export class ConfigValidator extends Ajv {
  public static instance: ConfigValidator = new ConfigValidator();

  constructor() {
    super();

    ConfigValidator.instance = this;

    Object.values(schemaRegistry).forEach((source) => {
      if ('$id' in source) {
        const schema = source as SchemaObject;
        this.addSchema(schema, schema.$id);
      } else {
        Object.values(source).forEach((schema) => {
          this.addSchema(schema, schema.$id);
        });
      }
    });
  }

  /**
   * Validate an unknown generable config object
   * @param generable - The class name of a generable config component
   * @param subtype - The subtype of the config component - Required for CustomParameter
   * @returns
   */
  static validate(
    generable: GenerableType,
    input: unknown,
    subtype?: GenerableSubtypes,
  ): ValidationResult {
    const schemaSource = schemaRegistry[generable];

    if ('$id' in schemaSource) {
      const schema = schemaSource as SchemaObject;

      return ConfigValidator.instance.validateComponent(schema, input);
    } else if (subtype !== undefined && subtype in schemaSource) {
      const schema = schemaSource[subtype] as ValidationMap;

      return ConfigValidator.instance.validateComponent(schema, input);
    } else {
      throw new Error(`No validator found for ${generable}:${subtype}`);
    }
  }

  validateComponent(schema: SchemaObject, data: unknown): ValidationResult {
    return super.validate(schema, data) || this.errors;
  }
}
