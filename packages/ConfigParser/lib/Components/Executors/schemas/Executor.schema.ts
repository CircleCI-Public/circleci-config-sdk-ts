import { SchemaObject } from 'ajv';

const ExecutorSchema: SchemaObject = {
  $id: '#/executor/Executor',
  type: 'object',
  $merge: {
    source: {
      anyOf: [
        { $ref: '#/executor/DockerExecutor' },
        { $ref: '#/executor/MachineExecutor' },
        { $ref: '#/executor/WindowsExecutor' },
        { $ref: '#/executor/MacOSExecutor' },
      ],
    },
    with: {
      properties: {
        shell: {
          type: 'string',
        },
        working_directory: {
          type: 'string',
        },
        environment: {
          type: 'object',
          additionalProperties: {
            anyOf: [{ type: 'string' }, { type: 'number' }],
          },
        },
      },
    },
  },
};

export default ExecutorSchema;
