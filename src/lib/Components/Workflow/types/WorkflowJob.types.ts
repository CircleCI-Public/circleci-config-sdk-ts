import { AbstractParameterType } from '../../Parameters/types/Parameters.types';

export type WorkflowJobParameters =
  | AbstractParameterType
  | WorkflowMatrixSchema
  | WorkflowFilterSchema;

/**
 * CircleCI provided parameters for all workflow jobs
 * @see WorkflowJobParameterSchema
 */
export interface BuiltInWorkflowJobParameterSchema {
  /**
   * A list of jobs that must succeed for the job to start. Note: When jobs in the current workflow that are listed as dependencies are not executed (due to a filter function for example), their requirement as a dependency for other jobs will be ignored by the requires option. However, if all dependencies of a job are filtered, then that job will not be executed either.
   */
  requires?: string[];
  name?: string;
  context?: string[];
  /**
   * {@link https://circleci.com/docs/2.0/configuration-reference/#filters} Filter workflow job's execution by branch or git tag.
   */
  filters?: WorkflowFilterSchema;
  /**
   * {@link https://circleci.com/docs/2.0/configuration-reference/#matrix-requires-version-21} The matrix stanza allows you to run a parameterized job multiple times with different arguments.
   */
  matrix?: WorkflowMatrixSchema;
  /**
   * An "approval" type job is a special job which pauses the workflow. This "job" is not defined outside of the workflow, you may enter any potential name for the job name. As long as the parameter of "type" is present and equal to "approval" this job will act as a placeholder that awaits user input to continue.
   */
  type?: 'approval';
}

/**
 * Custom parameters for workflow jobs
 * @see WorkflowJobParameterSchema
 */
export interface CustomWorkflowJobParameterSchema {
  [key: string]: WorkflowJobParameters;
}

/**
 * Full Workflow Job parameter type
 */
export type WorkflowJobParameterSchema =
  | CustomWorkflowJobParameterSchema
  | BuiltInWorkflowJobParameterSchema;

export interface WorkflowJobSchema {
  [workflowJobName: string]: {
    requires?: string[];
    context?: string[];
    type?: 'approval';
    filters?: WorkflowFilterSchema;
    matrix?: WorkflowMatrixSchema;
  };
}

export interface WorkflowFilterSchema {
  /**
   * A map defining rules for execution on specific branches
   */
  branches?: {
    /**
     * Either a single branch specifier, or a list of branch specifiers
     */
    only?: string[];
    /**
     * Either a single branch specifier, or a list of branch specifiers
     */
    ignore?: string[];
  };
  /**
   * A map defining rules for execution on specific tags
   */
  tags?: {
    /**
     * Either a single tag specifier, or a list of tag specifiers
     */
    only?: string[];
    /**
     * Either a single tag specifier, or a list of tag specifiers
     */
    ignore?: string[];
  };
}

/**
 * A map of parameter names to every value the job should be called with
 */
export interface WorkflowMatrixSchema {
  parameters: {
    [key: string]: string[];
  };
}
