import { WorkflowJobSchema } from './WorkflowJob.types';

export interface WorkflowSchema {
  [workflowName: string]: {
    jobs: WorkflowJobSchema[];
  };
}
