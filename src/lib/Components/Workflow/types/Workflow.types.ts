import { WorkflowJobParameters } from './WorkflowJob.types';

export type WorkflowsShape = {
  [workflowName: string]: {
    jobs: WorkflowJobParameters[];
  };
};

export type UnknownWorkflowShape = {
  jobs: { [key: string]: unknown }[];
};
