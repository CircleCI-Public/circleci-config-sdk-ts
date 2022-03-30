import { SchemaObject } from 'ajv';

const JobSchema: SchemaObject = {
  $id: '/definitions/Job',
  $merge: {
    source: {
      type: 'object',
      required: ['steps'],
      properties: {
        steps: {
          $ref: '/definitions/Steps',
        },
        parameters: {
          type: 'object',
          $ref: '/parameters/JobParameterList',
        },
      },
    },
    with: {
      oneOf: [
        {
          $ref: '/executor/Executor',
        },
        {
          $ref: '/executor/ReusableExecutor',
        },
      ],
    },
  },
};

export default JobSchema;
