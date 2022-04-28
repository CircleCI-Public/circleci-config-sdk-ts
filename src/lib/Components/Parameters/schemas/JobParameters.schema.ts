import { SchemaObject } from 'ajv';

const JobParametersSchema: SchemaObject = {
  $id: '#/parameters/JobParameters',
  type: 'object',
  oneOf: [
    { $ref: '#/parameters/EnumParameter' },
    { $ref: '#/parameters/StringParameter' },
    { $ref: '#/parameters/IntegerParameter' },
    { $ref: '#/parameters/BooleanParameter' },
    { $ref: '#/parameters/StepsParameter' },
    { $ref: '#/parameters/ExecutorParameter' },
    { $ref: '#/parameters/EnvVarNameParameter' },
  ],
};

export default JobParametersSchema;
