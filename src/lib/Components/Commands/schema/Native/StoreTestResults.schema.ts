import { SchemaObject } from 'ajv';

const StoreTestResultsSchema: SchemaObject = {
  $id: '/commands/native/StoreTestResults',
  type: 'object',
  required: ['path'],
  properties: {
    path: {
      type: 'string',
    },
  },
};

export default StoreTestResultsSchema;
