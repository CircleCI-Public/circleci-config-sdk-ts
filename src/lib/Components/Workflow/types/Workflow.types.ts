import { AnyConditionShape } from '../../Logic/types';
import { WorkflowJobAbstract } from '../exports/WorkflowJobAbstract';
import { WorkflowJobShape } from './WorkflowJob.types';

export type WorkflowsContentsShape = {
  when: AnyConditionShape;
  jobs: WorkflowJobShape[];
};

export type WorkflowsShape = Record<string, WorkflowsContentsShape>;
export type UnknownWorkflowShape = {
  jobs: { [key: string]: unknown }[];
};

export type UnknownWorkflowJobShape = {
  requires?: string[];
  parameters?: {
    [key: string]: unknown;
  };
  matrix?: { parameters: Record<string, string[]> };
  'pre-steps'?: unknown[];
  'post-steps'?: unknown[];
  name?: string;
  type?: 'approval';
};

export type WorkflowDependencies = {
  jobList: WorkflowJobAbstract[];
};
