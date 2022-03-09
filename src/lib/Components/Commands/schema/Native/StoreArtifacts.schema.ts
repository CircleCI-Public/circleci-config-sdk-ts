import { SchemaObject } from 'ajv';

const StoreArtifactsSchema: SchemaObject = {
  $id: '/commands/native/StoreArtifacts',
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
