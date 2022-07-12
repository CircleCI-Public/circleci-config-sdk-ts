import { SchemaObject } from 'ajv';

const ReusableCommandSchema: SchemaObject = {
  $id: '#/command/ReusableCommand',
  type: 'object',
  properties: {
    steps: {
      $ref: '#/definitions/Steps',
    },
  },
};

export default ReusableCommandSchema;
