import Ajv, { ErrorObject, SchemaObject } from 'ajv';
import ajvMergePatch from 'ajv-merge-patch';
import { GenerableSubtypes } from '../types/Mapping.types';
import { ValidationMap, ValidationResult } from '../types/Validator.types';
import {
  GenerableType,
  ParameterizedComponent,
  ParameterSubtype,
} from './Mapping';
import validationError from 'better-ajv-errors';
import { schemas } from '../../..';

const schemaRegistry: ValidationMap = {
  [GenerableType.ORB]: {},
  [GenerableType.ORB_IMPORT]: {},
  [GenerableType.ORB_REF]: {},

  [GenerableType.CONFIG]: schemas.ConfigSchema,
  [GenerableType.REUSABLE_COMMAND]:
    schemas.command.reusable.ReusableCommandSchema,
  [GenerableType.CUSTOM_COMMAND]: schemas.command.reusable.CustomCommandSchema,
  [GenerableType.RESTORE]: schemas.command.cache.RestoreSchema,
  [GenerableType.SAVE]: schemas.command.cache.SaveSchema,
  [GenerableType.ATTACH]: schemas.command.workspace.AttachWorkspaceSchema,
  [GenerableType.PERSIST]: schemas.command.workspace.PersistSchema,
  [GenerableType.ADD_SSH_KEYS]: schemas.command.AddSSHKeysSchema,
  [GenerableType.CHECKOUT]: schemas.command.CheckoutSchema,
  [GenerableType.RUN]: schemas.command.RunSchema,
  [GenerableType.SETUP_REMOTE_DOCKER]: schemas.command.SetupRemoteDockerSchema,
  [GenerableType.STORE_ARTIFACTS]: schemas.command.StoreArtifactsSchema,
  [GenerableType.STORE_TEST_RESULTS]: schemas.command.StoreTestResultsSchema,

  [GenerableType.ANY_EXECUTOR]: schemas.executor.ExecutorSchema,
  [GenerableType.DOCKER_EXECUTOR]: schemas.executor.DockerExecutableSchema,
  [GenerableType.MACHINE_EXECUTOR]: schemas.executor.MachineExecutableSchema,
  [GenerableType.MACOS_EXECUTOR]: schemas.executor.MacOSExecutableSchema,
  [GenerableType.WINDOWS_EXECUTOR]: schemas.executor.WindowsExecutableSchema,
  [GenerableType.REUSABLE_EXECUTOR]:
    schemas.executor.reusable.ReusableExecutorSchema,
  [GenerableType.REUSABLE_EXECUTOR_LIST]:
    schemas.executor.reusable.ReusableExecutorsListSchema,
  [GenerableType.REUSED_EXECUTOR]:
    schemas.executor.reusable.ReusableExecutorUsageSchema,

  [GenerableType.STEP]: schemas.command.steps.StepSchema,
  [GenerableType.STEP_LIST]: schemas.command.steps.StepsSchema,
  [GenerableType.JOB]: schemas.JobSchema,
  [GenerableType.WORKFLOW_JOB]: schemas.workflow.WorkflowJobSchema,
  [GenerableType.WORKFLOW]: schemas.workflow.WorkflowSchema,

  [GenerableType.CUSTOM_PARAMETER]: {
    /* Custom Parameter Config Components */
    [ParameterizedComponent.JOB]: schemas.parameter.JobParametersSchema,
    [ParameterizedComponent.COMMAND]: schemas.parameter.CommandParametersSchema,
    [ParameterizedComponent.EXECUTOR]:
      schemas.parameter.ExecutorParametersSchema,
    [ParameterizedComponent.PIPELINE]:
      schemas.parameter.PipelineParametersSchema,
    /** Custom Parameter Generics */
    [ParameterSubtype.STRING]: schemas.parameter.types.StringParameterSchema,
    [ParameterSubtype.BOOLEAN]: schemas.parameter.types.BooleanParameterSchema,
    [ParameterSubtype.INTEGER]: schemas.parameter.types.IntegerParameterSchema,
    [ParameterSubtype.EXECUTOR]:
      schemas.parameter.types.ExecutorParameterSchema,
    [ParameterSubtype.STEPS]: schemas.parameter.types.StepsParameterSchema,
    [ParameterSubtype.ENV_VAR_NAME]:
      schemas.parameter.types.EnvVarNameParameterSchema,
  },
  [GenerableType.CUSTOM_ENUM_PARAMETER]:
    schemas.parameter.types.EnumParameterSchema,
  [GenerableType.CUSTOM_PARAMETERS_LIST]: {
    [ParameterizedComponent.JOB]:
      schemas.parameter.lists.JobParameterListSchema,
    [ParameterizedComponent.COMMAND]:
      schemas.parameter.lists.CommandParameterListSchema,
    [ParameterizedComponent.EXECUTOR]:
      schemas.parameter.lists.ExecutorParameterListSchema,
    [ParameterizedComponent.PIPELINE]:
      schemas.parameter.lists.PipelineParameterListSchema,
  },

  [GenerableType.WHEN]: {},
  [GenerableType.AND]: {},
  [GenerableType.NOT]: {},
  [GenerableType.OR]: {},
  [GenerableType.EQUAL]: {},
  [GenerableType.PARAMETER_REFERENCE]: {},
  [GenerableType.TRUTHY]: {},
};

/**
 * An Ajv object that can validate a config and it's components
 * Does not handle validation of parameter usage.
 */
export class Validator extends Ajv {
  private static instance: Validator;

  public static validateOnParse: boolean;

  private constructor() {
    super({ allowUnionTypes: true });

    ajvMergePatch(this);

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
   * Access a generic singleton instance of the ConfigValidator
   * Useful if validating components without a Config object
   * Use the config's validator if Config has parameterized components.
   * @returns generic instance of ConfigValidator
   */

  static getInstance(): Validator {
    if (!Validator.instance) {
      Validator.instance = new Validator();
    }

    return Validator.instance;
  }

  /**
   * Validate an unknown generable config object
   * @param generable - The class name of a generable config component
   * @param subtype - The subtype of the config component - Required for CustomParameter
   * @returns
   */
  static validateGenerable(
    generable: GenerableType,
    input: unknown,
    subtype?: GenerableSubtypes,
  ): ValidationResult {
    const schemaSource = schemaRegistry[generable];

    if ('$id' in schemaSource) {
      const schema = schemaSource as SchemaObject;

      return Validator.getInstance().validateComponent(schema, input);
    } else if (subtype !== undefined && subtype in schemaSource) {
      const schema = schemaSource[subtype] as ValidationMap;

      return Validator.getInstance().validateComponent(schema, input);
    } else {
      throw new Error(`No validator found for ${generable}:${subtype}`);
    }
  }

  validateComponent(schema: SchemaObject, data: unknown): ValidationResult {
    const valid = super.validate(schema, data);

    if (!valid && Array.isArray(this.errors) && data) {
      return validationError(schema, data, this.errors as ErrorObject[]);
    }

    return valid;
  }
}
