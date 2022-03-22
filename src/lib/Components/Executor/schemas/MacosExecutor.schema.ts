import { SchemaObject } from 'ajv';

const MacOSExecutorSchema: SchemaObject = {
  $id: '/executor/MacOSExecutor',
  type: 'object',
  required: ['macos', 'resource_class'],
  properties: {
    resource_class: {
      enum: ['medium', 'large'],
    },
    description: {
      type: 'string',
    },
    macos: {
      type: 'object',
      required: ['xcode'],
      additionalProperties: false,
      properties: {
        xcode: {
          description:
            'The version of Xcode that is installed on the virtual machine, see the [Supported Xcode Versions section of the Testing iOS](https://circleci.com/docs/2.0/testing-ios/#supported-xcode-versions) document for the complete list.',
          type: 'string',
        },
      },
    },
  },
};

export default MacOSExecutorSchema;
