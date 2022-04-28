import { SchemaObject } from 'ajv';

const WorkflowSchema: SchemaObject = {
  $id: '#/definitions/Workflow',
  type: 'object',
  properties: {
    // TODO: when
    // TODO: triggers?
    jobs: {
      type: 'array',
      minItems: 1,
      items: { $ref: '#/definitions/WorkflowJob' },
    },
  },
};

export default WorkflowSchema;
