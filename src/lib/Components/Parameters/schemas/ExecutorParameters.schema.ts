import { SchemaObject } from 'ajv';

const ExecutorParametersSchema: SchemaObject = {
  $id: '#/parameters/ExecutorParameters',
  type: 'object',
  oneOf: [
    { $ref: '#/parameters/EnumParameter' },
    { $ref: '#/parameters/StringParameter' },
    { $ref: '#/parameters/IntegerParameter' },
  ],
};

export default ExecutorParametersSchema;
