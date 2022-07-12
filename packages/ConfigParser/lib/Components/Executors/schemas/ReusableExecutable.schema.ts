import { SchemaObject } from 'ajv';

export const ReusableExecutorUsageSchema: SchemaObject = {
  $id: '#/executor/ReusableExecutorUsage',
  type: 'object',
  oneOf: [
    {
      properties: {
        executor: { type: 'string' },
      },
    },
    {
      properties: {
        executor: {
          type: 'object',
          properties: {
            name: { type: 'string' },
          },
        },
      },
    },
  ],
};

export const ReusableExecutorSchema: SchemaObject = {
  $id: '#/executor/ReusableExecutor',
  type: 'object',
  $merge: {
    source: {
      properties: {
        parameters: {
          type: 'object',
          $ref: '#/parameters/ExecutorParameterList',
        },
      },
    },
    with: {
      $ref: '#/executor/Executor',
    },
  },
};

export const ReusableExecutorsListSchema: SchemaObject = {
  $id: '#/definitions/ReusableExecutorsList',
  type: 'object',
  required: ['executor'],
  patternProperties: {
    '^[a-z][a-z0-9_-]+$': {
      $ref: '#/executor/ReusableExecutor',
    },
  },
};
