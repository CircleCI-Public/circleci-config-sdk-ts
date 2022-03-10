import { SchemaObject } from 'ajv';

const CustomCommandSchema: SchemaObject = {
  $id: '/commands/native/Save',
  type: 'object',
  required: ['steps'],
  properties: {
    parameters: {
      type: 'object',
      $ref: '/parameters/CommandParameters',
    },
    steps: {
      type: 'array',
      $ref: '/definitions/Step',
    },
    when: {
      enum: ['always', 'on_success', 'on_fail'],
    },
  },
};

export default CustomCommandSchema;
