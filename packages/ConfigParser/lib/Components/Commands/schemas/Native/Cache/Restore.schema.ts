import { SchemaObject } from 'ajv';

const RestoreSchema: SchemaObject = {
  $id: '#/commands/native/restore_cache',
  type: 'object',
  oneOf: [
    {
      type: 'object',
      required: ['keys'],
      properties: {
        keys: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'string',
          },
        },
      },
    },
    {
      type: 'object',
      properties: {
        key: {
          type: 'string',
        },
      },
      required: ['key'],
    },
  ],
};

export default RestoreSchema;
