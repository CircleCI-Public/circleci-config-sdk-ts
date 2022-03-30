import { SchemaObject } from 'ajv';

const ReusableExecutorSchema: SchemaObject = {
  $id: '/executor/ReusableExecutor',
  type: 'object',
  required: ['executor'],
  properties: {
    executor: {
      $ref: '/custom/executor',
    },
  },
};

const ReusableExecutorsListSchema: SchemaObject = {
  $id: '/definitions/ReusableExecutorsList',
  type: 'object',
  required: ['executor'],
  patternProperties: {
    '^[a-z][a-z0-9_-]+$': {
      $merge: {
        source: {
          parameters: {
            type: 'object',
            $ref: '/parameters/ExecutorParameterList',
          },
        },
        with: {
          $ref: '/executor/Executor',
        },
      },
    },
  },
};

export { ReusableExecutorSchema, ReusableExecutorsListSchema };
