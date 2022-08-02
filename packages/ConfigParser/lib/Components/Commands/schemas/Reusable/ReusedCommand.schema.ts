import { SchemaObject } from 'ajv';

const ReusedCommandSchema: SchemaObject = {
  $id: '#/command/ReusableCommand',
  type: 'object',
  properties: {
    steps: {
      $ref: '#/definitions/Steps',
    },
  },
};

export default ReusedCommandSchema;
