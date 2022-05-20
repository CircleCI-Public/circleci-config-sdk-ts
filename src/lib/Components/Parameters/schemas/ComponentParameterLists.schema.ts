import { SchemaObject } from 'ajv';
import { genParameterListSchema } from '.';

const JobParameterListSchema: SchemaObject = genParameterListSchema('Job');
const CommandParameterListSchema: SchemaObject =
  genParameterListSchema('Command');
const ExecutorParameterListSchema: SchemaObject =
  genParameterListSchema('Executor');
const PipelineParameterListSchema: SchemaObject =
  genParameterListSchema('Pipeline');

export {
  JobParameterListSchema,
  CommandParameterListSchema,
  ExecutorParameterListSchema,
  PipelineParameterListSchema,
};
