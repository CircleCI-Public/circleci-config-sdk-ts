import { SchemaObject } from 'ajv';

const AddSSHKeysSchema: SchemaObject = {
  $id: '#/commands/native/add_ssh_keys',
  type: ['object', 'null'],
  properties: {
    fingerprints: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'string',
      },
    },
  },
};

export default AddSSHKeysSchema;
