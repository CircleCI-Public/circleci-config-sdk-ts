import { SchemaObject } from 'ajv';

const StoreTestResultsSchema: SchemaObject = {
  $id: '#/commands/native/store_test_results',
  type: 'object',
  required: ['path'],
  properties: {
    path: {
      type: 'string',
    },
  },
};

export default StoreTestResultsSchema;
