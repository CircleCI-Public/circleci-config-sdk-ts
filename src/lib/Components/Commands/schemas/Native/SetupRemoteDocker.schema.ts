import { SchemaObject } from 'ajv';

const SetupRemoteDockerSchema: SchemaObject = {
  $id: '#/commands/native/setup_remote_docker',
  type: 'object',
  required: [],
  additionalProperties: false,
  properties: {
    version: {
      type: 'string',
    },
  },
};

export default SetupRemoteDockerSchema;
