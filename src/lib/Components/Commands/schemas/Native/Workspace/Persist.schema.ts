import { SchemaObject } from 'ajv';

const PersistSchema: SchemaObject = {
  $id: '#/commands/native/persist_to_workspace',
  type: 'object',
  required: ['root', 'paths'],
  properties: {
    root: {
      type: 'string',
    },
    path: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'string',
      },
    },
  },
};

export default PersistSchema;
