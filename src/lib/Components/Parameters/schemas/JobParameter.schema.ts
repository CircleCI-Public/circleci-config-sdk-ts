import { SchemaObject } from 'ajv';

const JobParameterSchema: SchemaObject = {
  $id: '/parameters/JobParameter',
  type: 'object',
  oneOf: [
    { $ref: '/parameters/EnumParameter' },
    { $ref: '/parameters/StringParameter' },
    { $ref: '/parameters/IntegerParameter' },
    { $ref: '/parameters/BooleanParameter' },
    { $ref: '/parameters/StepsParameter' },
    { $ref: '/executors/Executor' },
  ],
};

export default JobParameterSchema;
