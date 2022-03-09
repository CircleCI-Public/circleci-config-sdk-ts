import { SchemaObject } from 'ajv';

const AttachWorkspaceSchema: SchemaObject = {
  $id: '/commands/native/workspace/Attach',
  type: 'object',
  required: ['at'],
  properties: {
    at: {
      type: 'string',
    },
  },
};

export default AttachWorkspaceSchema;
