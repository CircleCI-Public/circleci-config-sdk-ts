import { SchemaObject } from 'ajv';

const ExecutorSchema: SchemaObject = {
  $id: '/executors/Executor',
  description:
    'Executors define the environment in which the steps of a job will be run, allowing you to reuse a single executor definition across multiple jobs.',
  type: 'object',
  properties: {
    oneOf: [
      {
        type: 'object',
        additionalProperties: false,
        anyOf: [
          { $ref: '/executors/DockerExecutor' },
          { $ref: '/executors/MachineExecutor' },
          { $ref: '/executors/WindowsExecutor' },
          { $ref: '/executors/MacOSExecutor' },
        ],
      },
      {
        type: 'object',
        additionalProperties: false,
        properties: {
          name: {
            type: 'string',
            pattern: '^[a-z][a-z0-9_-]+$',
          },
        },
      },
      {
        type: 'string',
        pattern: '^[a-z][a-z0-9_-]+$',
      },
    ],
  },
  additionalProperties: {
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
        anyOf: [{ type: 'string' }, { type: 'number' }],
      },
    },
  },
};

export default ExecutorSchema;
