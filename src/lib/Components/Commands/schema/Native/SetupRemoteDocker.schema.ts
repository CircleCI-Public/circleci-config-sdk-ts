import { SchemaObject } from 'ajv';

const SetupRemoteDockerSchema: SchemaObject = {
  $id: '/commands/native/SetupRemoteDocker',
  type: 'object',
  required: ['command'],
  properties: {
    version: {
      type: 'string',
    },
  },
};

export default SetupRemoteDockerSchema;
