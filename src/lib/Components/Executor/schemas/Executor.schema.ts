import { SchemaObject } from 'ajv';

const ExecutorSchema: SchemaObject = {
  $id: '/executors/Executor',
  description:
    'Executors define the environment in which the steps of a job will be run, allowing you to reuse a single executor definition across multiple jobs.',
  type: 'object',
  required: ['executor'],
  properties: {
    executor: {
      type: 'object',
      additionalProperties: false,
      oneOf: [
        { $ref: '/executors/DockerExecutor' },
        { $ref: '/executors/MachineExecutor' },
        { $ref: '/executors/WindowsExecutor' },
        { $ref: '/executors/MacOSExecutor' },
      ],
    },
  },
  additionalProperties: {
    additionalProperties: false,
    anyOf: [
      {
        type: 'object',
        properties: {
          shell: {
            description:
              'Shell to use for execution command in all steps. Can be overridden by shell in each step (default: See [Default Shell Options](https://circleci.com/docs/2.0/configuration-reference/#default-shell-options)',
            type: 'string',
          },
        },
      },
      {
        type: 'object',
        properties: {
          working_directory: {
            description: 'In which directory to run the steps.',
            type: 'string',
          },
        },
      },
      {
        type: 'object',
        properties: {
          environment: {
            description: 'A map of environment variable names and values.',
            type: 'object',
            additionalProperties: {
              anyOf: [{ type: 'string' }, { type: 'number' }],
            },
          },
        },
      },
    ],
  },
};

export default ExecutorSchema;
