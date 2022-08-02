import Ajv, { ErrorObject, SchemaObject } from 'ajv';
import ajvMergePatch from 'ajv-merge-patch';
import { ValidationMap, ValidationResult } from '../types/Validator.types';

import validationError from 'better-ajv-errors';
import { schemas } from '../../..';
import * as CircleCI from '@circleci/circleci-config-sdk';

const schemaRegistry: ValidationMap = {
  [CircleCI.mapping.GenerableType.ORB]: {},
  [CircleCI.mapping.GenerableType.ORB_IMPORT]: {},
  [CircleCI.mapping.GenerableType.ORB_REF]: {},

  [CircleCI.mapping.GenerableType.CONFIG]: schemas.ConfigSchema,
  [CircleCI.mapping.GenerableType.REUSABLE_COMMAND]:
    schemas.command.reusable.ReusableCommandSchema,
  [CircleCI.mapping.GenerableType.REUSED_COMMAND]:
    schemas.command.reusable.ReusedCommandSchema,
  [CircleCI.mapping.GenerableType.RESTORE]: schemas.command.cache.RestoreSchema,
  [CircleCI.mapping.GenerableType.SAVE]: schemas.command.cache.SaveSchema,
  [CircleCI.mapping.GenerableType.ATTACH]:
    schemas.command.workspace.AttachWorkspaceSchema,
  [CircleCI.mapping.GenerableType.PERSIST]:
    schemas.command.workspace.PersistSchema,
  [CircleCI.mapping.GenerableType.ADD_SSH_KEYS]:
    schemas.command.AddSSHKeysSchema,
  [CircleCI.mapping.GenerableType.CHECKOUT]: schemas.command.CheckoutSchema,
  [CircleCI.mapping.GenerableType.RUN]: schemas.command.RunSchema,
  [CircleCI.mapping.GenerableType.SETUP_REMOTE_DOCKER]:
    schemas.command.SetupRemoteDockerSchema,
  [CircleCI.mapping.GenerableType.STORE_ARTIFACTS]:
    schemas.command.StoreArtifactsSchema,
  [CircleCI.mapping.GenerableType.STORE_TEST_RESULTS]:
    schemas.command.StoreTestResultsSchema,

  [CircleCI.mapping.GenerableType.ANY_EXECUTOR]:
    schemas.executor.ExecutorSchema,
  [CircleCI.mapping.GenerableType.DOCKER_EXECUTOR]:
    schemas.executor.DockerExecutableSchema,
  [CircleCI.mapping.GenerableType.MACHINE_EXECUTOR]:
    schemas.executor.MachineExecutableSchema,
  [CircleCI.mapping.GenerableType.MACOS_EXECUTOR]:
    schemas.executor.MacOSExecutableSchema,
  [CircleCI.mapping.GenerableType.WINDOWS_EXECUTOR]:
    schemas.executor.WindowsExecutableSchema,
  [CircleCI.mapping.GenerableType.REUSABLE_EXECUTOR]:
    schemas.executor.reusable.ReusableExecutorSchema,
  [CircleCI.mapping.GenerableType.REUSABLE_EXECUTOR_LIST]:
    schemas.executor.reusable.ReusableExecutorsListSchema,
  [CircleCI.mapping.GenerableType.REUSED_EXECUTOR]:
    schemas.executor.reusable.ReusableExecutorUsageSchema,

  [CircleCI.mapping.GenerableType.STEP]: schemas.command.steps.StepSchema,
  [CircleCI.mapping.GenerableType.STEP_LIST]: schemas.command.steps.StepsSchema,
  [CircleCI.mapping.GenerableType.JOB]: schemas.JobSchema,
  [CircleCI.mapping.GenerableType.WORKFLOW_JOB]:
    schemas.workflow.WorkflowJobSchema,
  [CircleCI.mapping.GenerableType.WORKFLOW]: schemas.workflow.WorkflowSchema,

  [CircleCI.mapping.GenerableType.CUSTOM_PARAMETER]: {
    /* Custom Parameter Config Components */
    [CircleCI.mapping.ParameterizedComponent.JOB]:
      schemas.parameter.JobParametersSchema,
    [CircleCI.mapping.ParameterizedComponent.COMMAND]:
      schemas.parameter.CommandParametersSchema,
    [CircleCI.mapping.ParameterizedComponent.EXECUTOR]:
      schemas.parameter.ExecutorParametersSchema,
    [CircleCI.mapping.ParameterizedComponent.PIPELINE]:
      schemas.parameter.PipelineParametersSchema,
    /** Custom Parameter Generics */
    [CircleCI.mapping.ParameterSubtype.STRING]:
      schemas.parameter.types.StringParameterSchema,
    [CircleCI.mapping.ParameterSubtype.BOOLEAN]:
      schemas.parameter.types.BooleanParameterSchema,
    [CircleCI.mapping.ParameterSubtype.INTEGER]:
      schemas.parameter.types.IntegerParameterSchema,
    [CircleCI.mapping.ParameterSubtype.EXECUTOR]:
      schemas.parameter.types.ExecutorParameterSchema,
    [CircleCI.mapping.ParameterSubtype.STEPS]:
      schemas.parameter.types.StepsParameterSchema,
    [CircleCI.mapping.ParameterSubtype.ENV_VAR_NAME]:
      schemas.parameter.types.EnvVarNameParameterSchema,
  },
  [CircleCI.mapping.GenerableType.CUSTOM_ENUM_PARAMETER]:
    schemas.parameter.types.EnumParameterSchema,
  [CircleCI.mapping.GenerableType.CUSTOM_PARAMETERS_LIST]: {
    [CircleCI.mapping.ParameterizedComponent.JOB]:
      schemas.parameter.lists.JobParameterListSchema,
    [CircleCI.mapping.ParameterizedComponent.COMMAND]:
      schemas.parameter.lists.CommandParameterListSchema,
    [CircleCI.mapping.ParameterizedComponent.EXECUTOR]:
      schemas.parameter.lists.ExecutorParameterListSchema,
    [CircleCI.mapping.ParameterizedComponent.PIPELINE]:
      schemas.parameter.lists.PipelineParameterListSchema,
  },

  [CircleCI.mapping.GenerableType.WHEN]: {},
  [CircleCI.mapping.GenerableType.AND]: {},
  [CircleCI.mapping.GenerableType.NOT]: {},
  [CircleCI.mapping.GenerableType.OR]: {},
  [CircleCI.mapping.GenerableType.EQUAL]: {},
  [CircleCI.mapping.GenerableType.PARAMETER_REFERENCE]: {},
  [CircleCI.mapping.GenerableType.TRUTHY]: {},
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
    generable: CircleCI.mapping.GenerableType,
    input: unknown,
    subtype?: CircleCI.types.config.mapping.GenerableSubtypes,
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
