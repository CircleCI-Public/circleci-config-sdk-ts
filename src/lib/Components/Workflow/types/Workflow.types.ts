import { AnyConditionShape } from '../../Logic/types';
import { WorkflowJobAbstract } from '../exports/WorkflowJobAbstract';
import { WorkflowJobShape } from './WorkflowJob.types';

export type WorkflowsShape = {
  [workflowName: string]: {
    when?: AnyConditionShape;
    jobs: WorkflowJobShape[];
  };
};

export type WorkflowContentsShape = {
  when?: AnyConditionShape;
  jobs: WorkflowJobShape[];
};

export type UnknownWorkflowShape = {
  jobs: { [key: string]: unknown }[];
};

export type UnknownWorkflowJobShape = {
  requires?: string[];
  parameters?: { [key: string]: unknown };
  name?: string;
  type?: 'approval';
};

export type WorkflowDependencies = {
  jobList: WorkflowJobAbstract[];
};
