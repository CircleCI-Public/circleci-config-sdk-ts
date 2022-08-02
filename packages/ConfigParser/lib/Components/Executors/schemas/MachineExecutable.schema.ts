import { SchemaObject } from 'ajv';

const MachineExecutableSchema: SchemaObject = {
  $id: '#/executor/MachineExecutor',
  type: 'object',
  properties: {
    resource_class: {
      enum: ['medium', 'large', 'xlarge', '2xlarge'],
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
        docker_layer_caching: {
          description:
            'Set to `true` to enable [Docker Layer Caching](https://circleci.com/docs/2.0/docker-layer-caching). Note: You must open a support ticket to have a CircleCI Sales representative contact you about enabling this feature on your account for an additional fee.',
          type: 'boolean',
        },
      },
    },
  },
};

export default MachineExecutableSchema;
