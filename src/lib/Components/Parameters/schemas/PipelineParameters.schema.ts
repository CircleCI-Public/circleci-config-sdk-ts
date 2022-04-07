import { SchemaObject } from 'ajv';

const PipelineParametersSchema: SchemaObject = {
  $id: '#/parameters/PipelineParameters',
  type: 'object',
  oneOf: [
    { $ref: '#/parameters/EnumParameter' },
    { $ref: '#/parameters/StringParameter' },
    { $ref: '#/parameters/IntegerParameter' },
    { $ref: '#/parameters/BooleanParameter' },
  ],
};

export default PipelineParametersSchema;
