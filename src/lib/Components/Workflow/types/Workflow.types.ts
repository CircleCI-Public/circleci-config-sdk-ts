import { AnyConditionShape } from '../../Logic/types';
import { WorkflowJob } from '../exports/WorkflowJob';
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

export type UnknownWorkflowJobShape = {
  requires?: string[];
  parameters?: { [key: string]: unknown };
  name?: string;
  type?: 'approval';
  // 'pre-steps'?: { [key: string]: unknown }[];
  // 'post-steps'?: { [key: string]: unknown }[];
};

export type WorkflowDependencies = {
  jobList: WorkflowJob[];
};
