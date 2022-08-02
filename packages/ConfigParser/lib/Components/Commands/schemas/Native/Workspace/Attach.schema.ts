import { SchemaObject } from 'ajv';

const AttachWorkspaceSchema: SchemaObject = {
  $id: '#/commands/native/attach_workspace',
  type: 'object',
  required: ['at'],
  properties: {
    at: {
      type: 'string',
    },
  },
};

export default AttachWorkspaceSchema;
