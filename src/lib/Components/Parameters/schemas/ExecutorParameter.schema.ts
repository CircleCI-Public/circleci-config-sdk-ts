import { SchemaObject } from 'ajv';

const ExecutorParameterSchema: SchemaObject = {
  $id: '/parameters/ExecutorParameter',
  type: 'object',
  oneOf: [
    { $ref: '/parameters/EnumParameter' },
    { $ref: '/parameters/StringParameter' },
    { $ref: '/parameters/IntegerParameter' },
  ],
};

export default ExecutorParameterSchema;
