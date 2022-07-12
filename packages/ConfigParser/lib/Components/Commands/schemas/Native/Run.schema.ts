import { SchemaObject } from 'ajv';

const RunSchema: SchemaObject = {
  $id: '#/commands/native/run',
  type: ['object', 'string'],
  required: ['command'],
  properties: {
    command: {
      type: 'string',
    },
    shell: {
      type: 'string',
    },
    environment: {
      description: 'A map of environment variable names and values',
      type: 'object',
      additionalProperties: {
        anyOf: [{ type: 'string' }, { type: 'number' }],
      },
    },
    background: {
      type: 'boolean',
    },
    working_directory: {
      type: 'string',
    },
    no_output_timeout: {
      type: 'string',
    },
    when: {
      enum: ['always', 'on_success', 'on_fail'],
    },
  },
};

export default RunSchema;
