import { SchemaObject } from 'ajv';

const WorkflowJobSchema: SchemaObject = {
  $id: '#/definitions/WorkflowJob',
  type: ['object', 'null', 'string'],
  properties: {
    requires: {
      type: 'array',
      items: { type: 'string' },
    },
    name: { type: 'string' },
    context: {
      oneOf: [
        {
          type: 'array',
          items: { type: 'string' },
          minItems: 1,
        },
        {
          type: 'string',
        },
      ],
    },
    type: {
      enum: ['approval'],
    },
    // TODO: matrix:
    // TODO: filters:
    'pre-steps': {
      $ref: '#/definitions/Steps',
    },
    'post-steps': {
      $ref: '#/definitions/Steps',
    },
  },
};

export default WorkflowJobSchema;
