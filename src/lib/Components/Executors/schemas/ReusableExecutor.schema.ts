import { SchemaObject } from 'ajv';

const ReusableExecutorRefSchema: SchemaObject = {
  $id: '#/executor/ReusableExecutor',
  type: 'object',
  required: ['executor'],
  oneOf: [
    {
      properties: {
        executor: { type: 'string' },
      },
      additionalProperties: false,
    },
    {
      properties: {
        executor: {
          type: 'object',
          properties: {
            name: { type: 'string' },
          },
        },
        additionalProperties: false,
      },
    },
  ],
};

const ReusableExecutorsListSchema: SchemaObject = {
  $id: '#/definitions/ReusableExecutorsList',
  type: 'object',
  required: ['executor'],
  patternProperties: {
    '^[a-z][a-z0-9_-]+$': {
      $merge: {
        source: {
          parameters: {
            type: 'object',
            $ref: '#/parameters/ExecutorParameterList',
          },
        },
        with: {
          $ref: '#/executor/Executor',
        },
      },
    },
  },
};

export {
  ReusableExecutorRefSchema as ReusableExecutorSchema,
  ReusableExecutorsListSchema,
};
