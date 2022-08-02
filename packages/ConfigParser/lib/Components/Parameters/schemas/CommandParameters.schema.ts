import { SchemaObject } from 'ajv';

const CommandParametersSchema: SchemaObject = {
  $id: '#/parameters/CommandParameters',
  type: 'object',
  anyOf: [
    { $ref: '#/parameters/EnumParameter' },
    { $ref: '#/parameters/StringParameter' },
    { $ref: '#/parameters/IntegerParameter' },
    { $ref: '#/parameters/BooleanParameter' },
    { $ref: '#/parameters/StepsParameter' },
    { $ref: '#/parameters/EnvVarNameParameter' },
  ],
};

export default CommandParametersSchema;
