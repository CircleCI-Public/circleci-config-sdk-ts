import { SchemaObject } from 'ajv';

const DockerExecutableSchema: SchemaObject = {
  $id: '#/executor/DockerExecutor',
  type: 'object',
  properties: {
    resource_class: {
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
      additionalItems: false,
      items: [
        {
          additionalProperties: false,
          type: 'object',
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
                anyOf: [{ type: 'string' }, { type: 'number' }],
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

export default DockerExecutableSchema;
