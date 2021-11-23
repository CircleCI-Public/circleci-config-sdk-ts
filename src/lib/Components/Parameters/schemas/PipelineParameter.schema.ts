import { SchemaObject } from 'ajv';

const PipelineParameterSchema: SchemaObject = {
  $id: '/parameters/PipelineParameter',
  type: 'object',
  oneOf: [
    { $ref: '/parameters/EnumParameter' },
    { $ref: '/parameters/StringParameter' },
    { $ref: '/parameters/IntegerParameter' },
    { $ref: '/parameters/BooleanParameter' },
  ],
};

export default PipelineParameterSchema;
