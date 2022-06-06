import { SchemaObject } from 'ajv';

const ConfigSchema: SchemaObject = {
  $id: '#/definitions/Config',
  type: 'object',
  properties: {
    workflows: {
      type: 'object',
      patternProperties: {
        '^.*$': {
          $ref: '#/definitions/Workflow',
        },
      },
    },
    jobs: {
      type: 'object',
      patternProperties: {
        '^.*$': {
          $ref: '#/definitions/Job',
        },
      },
    },
    executors: {
      type: 'object',
      patternProperties: {
        '^.*$': {
          $ref: '#/executor/Executor', // TODO: Move executor under /definitions
        },
      },
    },
    parameters: {
      type: 'object',
      patternProperties: {
        '^.*$': {
          $ref: '#/parameters/PipelineParameters', // TODO: Move parameters under /definitions
        },
      },
    },
    commands: {
      type: 'object',
      patternProperties: {
        '^.*$': {
          $ref: '#/commands/custom_command', // TODO: Move commands under /definitions
        },
      },
    },
  },
};

export default ConfigSchema;
