import { SchemaObject } from 'ajv';

const CommandParameterSchema: SchemaObject = {
  $id: '/parameters/CommandParameter',
  type: 'object',
  oneOf: [
    { $ref: '/parameters/EnumParameter' },
    { $ref: '/parameters/StringParameter' },
    { $ref: '/parameters/IntegerParameter' },
    { $ref: '/parameters/BooleanParameter' },
    { $ref: '/parameters/StepsParameter' },
    { $ref: '/parameters/EnvVarNameParameter' },
  ],
};

export default CommandParameterSchema;
