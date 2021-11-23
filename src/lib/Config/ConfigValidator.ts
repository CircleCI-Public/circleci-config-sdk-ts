import Ajv, { ErrorObject, SchemaObject } from 'ajv';
import DockerExecutorSchema from '../Components/Executor/schemas/DockerExecutor.schema';
import MachineExecutorSchema from '../Components/Executor/schemas/MachineExecutor.schema';
import MacOSExecutorSchema from '../Components/Executor/schemas/MacosExecutor.schema';
import WindowsExecutorSchema from '../Components/Executor/schemas/WindowsExecutor.schema';
import CommandParameterSchema from '../Components/Parameters/schemas/CommandParameter.schema';
import {
  CommandParameterListSchema,
  ExecutorParameterListSchema,
  JobParameterListSchema,
  PipelineParameterListSchema,
} from '../Components/Parameters/schemas/ComponentParameterLists.schema';
import ExecutorParameterSchema from '../Components/Parameters/schemas/ExecutorParameter.schema';
import JobParameterSchema from '../Components/Parameters/schemas/JobParameter.schema';
import {
  BooleanParameterSchema,
  EnumParameterSchema,
  EnvVarNameParameterSchema,
  IntegerParameterSchema,
  StepsParameterSchema,
  StringParameterSchema,
} from '../Components/Parameters/schemas/ParameterTypes.schema';
import PipelineParameterSchema from '../Components/Parameters/schemas/PipelineParameter.schema';

export type ValidationResult = boolean | ErrorObject[] | null | undefined;
export class ConfigValidator extends Ajv {
  static schemas: SchemaObject[] = [
    EnumParameterSchema,
    StringParameterSchema,
    BooleanParameterSchema,
    IntegerParameterSchema,
    StepsParameterSchema,
    EnvVarNameParameterSchema,
    ExecutorParameterListSchema,
    ExecutorParameterSchema,
    JobParameterListSchema,
    JobParameterSchema,
    CommandParameterListSchema,
    CommandParameterSchema,
    PipelineParameterListSchema,
    PipelineParameterSchema,
    DockerExecutorSchema,
    MachineExecutorSchema,
    MacOSExecutorSchema,
    WindowsExecutorSchema,
  ];

  constructor() {
    super();

    ConfigValidator.schemas.forEach((schema) => {
      this.addSchema(schema, schema.$id);
    });
  }

  validateData(schema: SchemaObject, data: unknown): ValidationResult {
    return super.validate(schema, data) || this.errors;
  }
}
