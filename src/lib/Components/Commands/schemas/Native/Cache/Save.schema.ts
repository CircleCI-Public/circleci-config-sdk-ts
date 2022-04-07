import { SchemaObject } from 'ajv';

const SaveSchema: SchemaObject = {
  $id: '#/commands/native/save_cache',
  type: 'object',
  required: ['paths', 'key'],
  properties: {
    paths: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'string',
      },
    },
    key: {
      type: 'string',
    },
    when: {
      enum: ['always', 'on_success', 'on_fail'],
    },
  },
};

export default SaveSchema;
