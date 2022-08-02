import { SchemaObject } from 'ajv';

const StoreArtifactsSchema: SchemaObject = {
  $id: '#/commands/native/store_artifacts',
  type: 'object',
  required: ['path'],
  properties: {
    path: {
      type: 'string',
    },
    destination: {
      type: 'string',
    },
  },
};

export default StoreArtifactsSchema;
