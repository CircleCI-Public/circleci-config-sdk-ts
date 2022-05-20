import { SchemaObject } from 'ajv';

const ConfigSchema: SchemaObject = {
  $id: '#/definitions/Config',
  type: 'object',
  properties: {
    workflows: {
      patternProperties: {
        '^.*$': {
          $ref: '#/definitions/Workflow',
        },
      },
    },
    jobs: {
      patternProperties: {
        '^.*$': {
          $ref: '#/definitions/Job',
        },
      },
    },
    executors: {
      patternProperties: {
        '^.*$': {
          $ref: '#/executor/Executor', // TODO: Move executor under /definitions
        },
      },
    },
    parameters: {
      patternProperties: {
        '^.*$': {
          $ref: '#/parameters/PipelineParameters', // TODO: Move parameters under /definitions
        },
      },
    },
    commands: {
      patternProperties: {
        '^.*$': {
          $ref: '#/commands/custom_command', // TODO: Move commands under /definitions
        },
      },
    },
  },
};

export default ConfigSchema;
