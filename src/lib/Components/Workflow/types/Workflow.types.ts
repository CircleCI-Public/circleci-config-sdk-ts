import { WorkflowJobParameters } from './WorkflowJob.types';

export interface WorkflowShape {
  [workflowName: string]: {
    jobs: WorkflowJobParameters[];
  };
}
