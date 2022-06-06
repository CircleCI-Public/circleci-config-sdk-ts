import { SchemaObject } from 'ajv';

const WindowsExecutableSchema: SchemaObject = {
  $id: '#/executor/WindowsExecutor',
  type: 'object',
  properties: {
    resource_class: {
      enum: [
        'windows.medium',
        'windows.large',
        'windows.xlarge',
        'windows.2xlarge',
      ],
    },
    description: {
      type: 'string',
    },
    machine: {
      type: 'object',
      required: ['image'],
      additionalProperties: false,
      properties: {
        image: {
          description:
            'The VM image to use. View [available images](https://circleci.com/docs/2.0/configuration-reference/#available-machine-images). **Note:** This key is **not** supported on the installable CircleCI. For information about customizing machine executor images on CircleCI installed on your servers, see our [VM Service documentation](https://circleci.com/docs/2.0/vm-service).',
          type: 'string',
        },
      },
    },
  },
};

export default WindowsExecutableSchema;
