import { WorkflowJobParameters } from './WorkflowJob.types';

export interface WorkflowShape {
  [workflowName: string]: {
    jobs: WorkflowJobParameters[];
  };
}

export type UnknownWorkflowShape = {
  jobs: { [key: string]: unknown }[];
};
