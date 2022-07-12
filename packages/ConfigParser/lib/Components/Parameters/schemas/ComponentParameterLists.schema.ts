import { SchemaObject } from 'ajv';

const genParameterListSchema = (type: string): SchemaObject => {
  return {
    $id: `#/parameters/${type}ParameterList`,
    type: 'object',
    description:
      'https://circleci.com/docs/2.0/reusing-config/#using-the-parameters-declaration\n\nA map of parameter keys.',
    patternProperties: {
      '^[a-z][a-z0-9_-]+$': { $ref: `#/parameters/${type}Parameters` },
    },
  };
};

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
