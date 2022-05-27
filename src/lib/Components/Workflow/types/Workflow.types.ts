import { AnyConditionShape } from '../../Logic/types';
import { WorkflowJobShape } from './WorkflowJob.types';

export type WorkflowsShape = {
  [workflowName: string]: {
    when: AnyConditionShape;
    jobs: WorkflowJobShape[];
  };
};

export type UnknownWorkflowShape = {
  jobs: { [key: string]: unknown }[];
};
