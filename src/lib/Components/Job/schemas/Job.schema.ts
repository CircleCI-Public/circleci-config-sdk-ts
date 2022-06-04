import { SchemaObject } from 'ajv';

/*
 * Schema for both parameterized and static jobs.
 */
const JobSchema: SchemaObject = {
  $id: '#/definitions/Job',
  $merge: {
    source: {
      type: 'object',
      required: ['steps'],
      properties: {
        steps: {
          $ref: '#/definitions/Steps',
        },
        parameters: {
          type: 'object',
          $ref: '#/parameters/JobParameterList',
        },
        parallelism: {
          type: 'integer',
          minimum: 1,
        },
      },
    },
    with: {
      anyOf: [
        {
          $ref: '#/executor/ReusableExecutorUsage',
        },
        {
          $ref: '#/executor/Executor',
        },
      ],
    },
  },
};

export default JobSchema;
