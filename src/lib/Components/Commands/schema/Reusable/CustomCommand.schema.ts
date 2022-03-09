import { SchemaObject } from 'ajv';

const CustomCommandSchema: SchemaObject = {
  $id: '/commands/native/Save',
  type: 'object',
  required: ['paths', 'key'],
  properties: {
    parameters: {
      type: 'object',
      $ref: '/parameters/CommandParameter',
    },
    steps: {
      type: 'array',
      anyOf: [
        { $ref: '/commands/native/Save' },
        { $ref: '/commands/native/Restore' },
        { $ref: '/commands/native/Attach' },
        { $ref: '/commands/native/Persist' },
        { $ref: '/commands/native/AddSSHKeys' },
        { $ref: '/commands/native/Checkout' },
        { $ref: '/commands/native/Run' },
        { $ref: '/commands/native/SetupRemoteDocker' },
        { $ref: '/commands/native/StoreArtifacts' },
        { $ref: '/commands/native/StoreTestResults' },
      ],
    },
    when: {
      enum: ['always', 'on_success', 'on_fail'],
    },
  },
};

export default CustomCommandSchema;
