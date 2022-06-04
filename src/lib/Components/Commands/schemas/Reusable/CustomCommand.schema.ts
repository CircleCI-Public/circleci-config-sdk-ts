import { SchemaObject } from 'ajv';

const CustomCommandSchema: SchemaObject = {
  $id: '#/commands/custom_command',
  type: 'object',
  required: ['steps'],
  properties: {
    parameters: {
      type: 'object',
      $ref: '#/parameters/CommandParameterList',
    },
    steps: {
      $ref: '#/definitions/Steps',
    },
    when: {
      enum: ['always', 'on_success', 'on_fail'],
    },
  },
};

export default CustomCommandSchema;
