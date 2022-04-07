import { SchemaObject } from 'ajv';

const WorkflowJobSchema: SchemaObject = {
  $id: '#/definitions/WorkflowJob',
  type: 'object',
  patternProperties: {
    '^.*$': {
      properties: {
        requires: {
          type: 'array',
          // TODO: items will need to be an enum to available jobs
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
    },
  },
};

export default WorkflowJobSchema;
