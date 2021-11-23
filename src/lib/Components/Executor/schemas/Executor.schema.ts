import { Schema } from 'jsonschema';

const abstractExecutorSchema: Schema = {
  id: '/executors/AbstractExecutor',
  description:
    'Executors define the environment in which the steps of a job will be run, allowing you to reuse a single executor definition across multiple jobs.',
  type: 'object',
  properties: {
    shell: {
      description:
        'Shell to use for execution command in all steps. Can be overridden by shell in each step (default: See [Default Shell Options](https://circleci.com/docs/2.0/configuration-reference/#default-shell-options)',
      type: 'string',
    },
    working_directory: {
      description: 'In which directory to run the steps.',
      type: 'string',
    },
    environment: {
      description: 'A map of environment variable names and values.',
      type: 'object',
      additionalProperties: {
        type: ['string', 'number'],
      },
    },
  },
};

const dockerExecutorSchema: Schema = {
  id: '/executors/DockerExecutor',
  type: 'object',
  required: ['docker', 'resource_class'],
  additionalProperties: {
    $ref: '/executors/AbstractExecutor',
    additionalProperties: false,
  },
  properties: {
    resource_class: {
      type: 'enum',
      enum: [
        'small',
        'medium',
        'medium+',
        'large',
        'xlarge',
        '2xlarge',
        '2xlarge+',
      ],
    },
    description: {
      type: 'string',
    },
    docker: {
      type: 'array',
      minItems: 1,
      items: [
        {
          additionalProperties: false,
          properties: {
            image: {
              description: 'The name of a custom docker image to use',
              type: 'string',
            },
            name: {
              description:
                'The name the container is reachable by. By default, container services are accessible through `localhost`',
              type: 'string',
            },
            entrypoint: {
              description:
                'The command used as executable when launching the container',
              oneOf: [
                {
                  type: 'string',
                },
                {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                },
              ],
            },
            command: {
              description:
                'The command used as pid 1 (or args for entrypoint) when launching the container',
              oneOf: [
                {
                  type: 'string',
                },
                {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                },
              ],
            },
            user: {
              description: 'Which user to run the command as',
              type: 'string',
            },
            environment: {
              description: 'A map of environment variable names and values',
              type: 'object',
              additionalProperties: {
                type: ['string', 'number'],
              },
            },
            auth: {
              description:
                'Authentication for registries using standard `docker login` credentials',
              type: 'object',
              additionalProperties: false,
              properties: {
                username: {
                  type: 'string',
                },
                password: {
                  type: 'string',
                },
              },
            },
            aws_auth: {
              description:
                'Authentication for AWS EC2 Container Registry (ECR)',
              type: 'object',
              additionalProperties: false,
              properties: {
                aws_access_key_id: {
                  type: 'string',
                },
                aws_secret_access_key: {
                  type: 'string',
                },
              },
            },
          },
          required: ['image'],
        },
      ],
    },
  },
};

const machineExecutorSchema: Schema = {
  id: '/executors/MachineExecutor',
  type: 'object',
  required: ['machine', 'resource_class'],
  additionalProperties: {
    $ref: '/executors/AbstractExecutor',
    additionalProperties: false,
  },
  properties: {
    resource_class: {
      type: 'enum',
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

const windowsExecutorSchema: Schema = {
  id: '/executors/WindowsExecutor',
  type: 'object',
  allOf: [{ $ref: '/executors/AbstractExecutor' }],
  required: ['machine', 'resource_class'],
  properties: {
    resource_class: {
      type: 'enum',
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

const macOSExecutorSchema: Schema = {
  id: '/executors/MachineExecutor',
  type: 'object',
  required: ['macos', 'resource_class'],
  additionalProperties: {
    $ref: '/executors/AbstractExecutor',
    additionalProperties: false,
  },
  properties: {
    resource_class: {
      type: 'enum',
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

// const reusableExecutorSchema = {
//   id: '/executors/ReusableExecutor',
//   type: 'object',
//   required: ['reusable'],
//   additionalProperties: false,
//   properties: {
//     reusable: {
//       type: 'string',
//     },
// }

export {
  abstractExecutorSchema,
  dockerExecutorSchema,
  machineExecutorSchema,
  macOSExecutorSchema,
  windowsExecutorSchema,
};
