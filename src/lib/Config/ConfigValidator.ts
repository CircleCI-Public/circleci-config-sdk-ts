import Ajv, { SchemaObject } from 'ajv';
import { Config } from '.';
import { Generable } from '../Components';
import AddSSHKeysSchema from '../Components/Commands/schema/Native/AddSSHKeys.schema';
import RestoreSchema from '../Components/Commands/schema/Native/Cache/Restore.schema';
import SaveSchema from '../Components/Commands/schema/Native/Cache/Save.schema';
import CheckoutSchema from '../Components/Commands/schema/Native/Checkout.schema';
import RunSchema from '../Components/Commands/schema/Native/Run.schema';
import SetupRemoteDockerSchema from '../Components/Commands/schema/Native/SetupRemoteDocker.schema';
import StoreArtifactsSchema from '../Components/Commands/schema/Native/StoreArtifacts.schema';
import StoreTestResultsSchema from '../Components/Commands/schema/Native/StoreTestResults.schema';
import AttachWorkspaceSchema from '../Components/Commands/schema/Native/Workspace/Attach.schema';
import PersistSchema from '../Components/Commands/schema/Native/Workspace/Persist.schema';
import CustomCommandSchema from '../Components/Commands/schema/Reusable/CustomCommand.schema';
import {
  StepSchema,
  StepsSchema,
} from '../Components/Commands/schema/Steps.schema';
import DockerExecutorSchema from '../Components/Executor/schemas/DockerExecutor.schema';
import ExecutorSchema from '../Components/Executor/schemas/Executor.schema';
import MachineExecutorSchema from '../Components/Executor/schemas/MachineExecutor.schema';
import MacOSExecutorSchema from '../Components/Executor/schemas/MacosExecutor.schema';
import {
  ReusableExecutorSchema,
  ReusableExecutorsListSchema,
} from '../Components/Executor/schemas/ReusableExecutor.schema';
import WindowsExecutorSchema from '../Components/Executor/schemas/WindowsExecutor.schema';
import { Job } from '../Components/Job';
import { ParameterizedJob } from '../Components/Job/exports/ParameterizedJob';
import { CustomEnumParameter, CustomParameter } from '../Components/Parameters';
import { Parameterized } from '../Components/Parameters/exports/Parameterized';
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
import { AnyParameterLiteral } from '../Components/Parameters/types/CustomParameterLiterals.types';
import {
  GenerableSubtypes,
  GenerableType,
  ParameterizedComponent,
  ParameterSubtype,
  ValidationMap,
  ValidationResult,
} from './types/Config.types';
import ajvMergePatch from 'ajv-merge-patch';
import JobSchema from '../Components/Job/schema/Job.schema';
import { ReusableExecutor } from '../Components/Executor';

const schemaRegistry: ValidationMap = {
  [GenerableType.REUSABLE_COMMAND]: {},
  [GenerableType.CUSTOM_COMMAND]: CustomCommandSchema,
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

  [GenerableType.ANY_EXECUTOR]: ExecutorSchema,
  [GenerableType.DOCKER_EXECUTOR]: DockerExecutorSchema,
  [GenerableType.MACHINE_EXECUTOR]: MachineExecutorSchema,
  [GenerableType.MACOS_EXECUTOR]: MacOSExecutorSchema,
  [GenerableType.WINDOWS_EXECUTOR]: WindowsExecutorSchema,
  [GenerableType.REUSABLE_EXECUTOR]: ReusableExecutorSchema,
  [GenerableType.REUSABLE_EXECUTOR_LIST]: ReusableExecutorsListSchema,

  [GenerableType.STEP]: StepSchema,
  [GenerableType.STEP_LIST]: StepsSchema,
  [GenerableType.JOB]: JobSchema,
  [GenerableType.WORKFLOW_JOB]: {},

  [GenerableType.CUSTOM_PARAMETER]: {
    /* Custom Parameter Config Components */
    [ParameterizedComponent.JOB]: JobParametersSchema,
    [ParameterizedComponent.COMMAND]: CommandParametersSchema,
    [ParameterizedComponent.EXECUTOR]: ExecutorParametersSchema,
    [ParameterizedComponent.PIPELINE]: PipelineParametersSchema,
    /** Custom Parameter Generics */
    [ParameterSubtype.STRING]: StringParameterSchema,
    [ParameterSubtype.BOOLEAN]: BooleanParameterSchema,
    [ParameterSubtype.INTEGER]: IntegerParameterSchema,
    [ParameterSubtype.EXECUTOR]: ExecutorParameterSchema,
    [ParameterSubtype.STEPS]: StepsParameterSchema,
    [ParameterSubtype.ENV_VAR_NAME]: EnvVarNameParameterSchema,
  },
  [GenerableType.CUSTOM_ENUM_PARAMETER]: EnumParameterSchema,
  [GenerableType.CUSTOM_PARAMETERS_LIST]: {
    [ParameterizedComponent.JOB]: JobParameterListSchema,
    [ParameterizedComponent.COMMAND]: CommandParameterListSchema,
    [ParameterizedComponent.EXECUTOR]: ExecutorParameterListSchema,
    [ParameterizedComponent.PIPELINE]: PipelineParameterListSchema,
  },
};

// TODO: Potentially make name an interface so that we can have a type guard without this type
export type NamedGenerable = Generable &
  Parameterized<AnyParameterLiteral> & { name: string };

export class ConfigValidator extends Ajv {
  private config?: Config;
  private static genericInstance: ConfigValidator;

  schemaGroups: { [key: string]: SchemaObject } = {
    command: {
      $id: `/custom/command`,
      type: 'object',
      minProperties: 1,
      maxProperties: 1,
      additionalProperties: false,
      properties: {},
    },
    job: {
      $id: `/custom/job`,
      type: 'object',
      minProperties: 1,
      maxProperties: 1,
      additionalProperties: false,
      properties: {},
    },
    executor: {
      $id: `/custom/executor`,
      oneOf: [
        {
          enum: [''], // TODO: Do not validate with an empty name
        },
      ],
    },
  };

  constructor(config?: Config) {
    super();

    this.config = config;

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

    if (this.config) {
      const configSchema = this.buildParameterizedSchema(
        this.config,
        'pipeline',
        'config',
      );

      if (configSchema) {
        this.addSchema(configSchema);
      }
    }

    const customSchemas = {
      command: this.config?.commands,
      job: this.config?.jobs,
      executor: this.config?.executors,
    };

    Object.entries(customSchemas).forEach(([generableType, list]) => {
      /*
         example: {
           $id: `/custom/commands`,
           type: 'object',
           additionalProperties: false,
           properties: {
             search_year: { * command name
               $ref: '/command/custom/search_year', * command parameters
             },
           },
         };
        */

      if (list) {
        list.forEach((generable) => {
          if (
            generable instanceof ParameterizedJob ||
            !(generable instanceof Job)
          ) {
            const schema = this.buildGenerableSchema(generable);

            if (schema) {
              this.addSchema(schema, schema.$id);

              if (generable instanceof ReusableExecutor) {
                this.schemaGroups[generableType].oneOf.push({
                  $ref: schema.$id,
                });
              } else {
                this.schemaGroups[generableType].properties[generable.name] = {
                  $ref: schema.$id,
                };
              }
            }
          }
        });
      }

      const schemaGroup = this.schemaGroups[generableType];

      this.addSchema(schemaGroup, schemaGroup.$id);
    });
  }

  /**
   * Access a generic singleton instance of the ConfigValidator
   * Useful if validating components without a Config object
   * Use the config's validator if Config has parameterized components.
   * @returns generic instance of ConfigValidator
   */
  static getGeneric(): ConfigValidator {
    if (!ConfigValidator.genericInstance) {
      ConfigValidator.genericInstance = new ConfigValidator();
    }

    return ConfigValidator.genericInstance;
  }

  addGenerableSchema(generable: NamedGenerable): void {
    const schema = this.buildGenerableSchema(generable);

    if (schema && generable.generableType in this.schemaGroups) {
      const type = generable.generableType as 'command' | 'job' | 'executor';
      this.removeSchema(`/custom/${generable.generableType}`);
      const schemaGroup: SchemaObject = this.schemaGroups[type];

      if (generable instanceof ReusableExecutor) {
        schemaGroup.oneOf.push({
          $ref: schema.$id,
        });
      } else {
        schemaGroup.properties[generable.name] = {
          $ref: schema.$id,
        };
      }

      this.addSchema(schema, schema.$id);
      this.addSchema(schemaGroup, schemaGroup.$id);
    }
  }

  /**
   * Generate a schema for a given Generable component
   * @param generable - Generable component to generate a schema for
   * @returns schema for the given Generable
   */
  buildGenerableSchema(generable: NamedGenerable): SchemaObject | undefined {
    return this.buildParameterizedSchema(
      generable,
      generable.generableType,
      generable.name,
    );
  }

  /**
   * Generate a schema for a given Parameterized component
   * @param parameterized - Parameterized component to generate a schema for
   * @returns schema for the given Parameterized
   */
  buildParameterizedSchema(
    parameterized: Parameterized<AnyParameterLiteral>,
    type: string,
    name: string,
  ): SchemaObject | undefined {
    const parametersSchema: SchemaObject = {
      type: 'object',
      required: [],
      properties: {},
      additionalProperties: false,
    };

    /* example: {
      $id: `/command/custom/search_year`,
      type: 'object',
      required: [],
      additionalProperties: false,
      properties: {
        year: {
          type: 'integer',
        },
      },
    };
    */
    const paramTypes: {
      [key in AnyParameterLiteral]:
        | SchemaObject
        | ((parameter: CustomParameter<AnyParameterLiteral>) => SchemaObject);
    } = {
      string: {
        type: 'string',
      },
      boolean: {
        type: 'boolean',
      },
      integer: {
        type: 'integer',
      },
      enum: (parameter) => ({
        enum: (parameter as CustomEnumParameter).enumValues,
      }),
      executor: {
        oneOf: [{ $ref: `/executor/Executor` }, { $ref: `/custom/executor` }],
      },
      steps: {
        $ref: '/definitions/steps',
      },
      env_var_name: {
        type: 'string',
        pattern: '^[a-zA-Z][a-zA-Z0-9_-]+$',
      },
    };

    let someRequired = false;

    if (parameterized.parameters) {
      for (const parameter of parameterized.parameters) {
        const type = paramTypes[parameter.type];
        parametersSchema.properties[parameter.name] =
          typeof type === 'object' ? type : type(parameter);
        if (!parameter.defaultValue) {
          someRequired = true;
          parametersSchema.required.push(parameter.name);
        }
      }
    }

    if (parameterized instanceof ReusableExecutor) {
      if (!someRequired) {
        this.schemaGroups.executor.oneOf[0].enum.push(parameterized.name);
      }

      const reuseExecutorSchema: SchemaObject = {
        $id: `/${type}/custom/${name}`,
        type: 'object',
        ...parametersSchema,
        properties: {
          name: {
            enum: [name],
          },
          ...parametersSchema.properties,
        },
      };

      return reuseExecutorSchema;
    } else {
      if (!parameterized.parameters) {
        return undefined;
      }

      return {
        $id: `/${type}/custom/${name}`,
        ...parametersSchema,
      };
    }
  }

  /**
   * Validate an unknown generable config object
   * @param generable - The class name of a generable config component
   * @param subtype - The subtype of the config component - Required for CustomParameter
   * @returns
   */
  validateGenerable(
    generable: GenerableType,
    input: unknown,
    subtype?: GenerableSubtypes,
  ): ValidationResult {
    const schemaSource = schemaRegistry[generable];

    if ('$id' in schemaSource) {
      const schema = schemaSource as SchemaObject;

      return this.validateComponent(schema, input);
    } else if (subtype !== undefined && subtype in schemaSource) {
      const schema = schemaSource[subtype] as ValidationMap;

      return this.validateComponent(schema, input);
    } else {
      throw new Error(`No validator found for ${generable}:${subtype}`);
    }
  }

  // TODO: Give this a better name. All this does is return the error if there are any
  validateComponent(schema: SchemaObject, data: unknown): ValidationResult {
    return super.validate(schema, data) || this.errors;
  }
}
