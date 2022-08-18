import { SchemaObject } from 'ajv';

const RestoreSchema: SchemaObject = {
  $id: '#/commands/native/restore_cache',
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
      type: 'string',
    },
  ],
};

export default RestoreSchema;
