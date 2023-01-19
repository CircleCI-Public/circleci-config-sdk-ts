import {
  FilterParameter,
  ListParameter,
  MatrixParameter,
  StepsParameter,
  StringParameter,
} from '../../Parameters/types';
import {
  ComponentParameter,
  JobParameterTypes,
} from '../../Parameters/types/ComponentParameters.types';
import { AnyCommandShape } from '../../Commands/types/Command.types';

/**
 * CircleCI provided parameters for all workflow jobs
 * @see WorkflowJobParameterShape
 */
export interface WorkflowJobParameters
  extends ComponentParameter<JobParameterTypes> {
  /**
   * A list of jobs that must succeed for the job to start. Note: When jobs in the current workflow that are listed as dependencies are not executed (due to a filter function for example), their requirement as a dependency for other jobs will be ignored by the requires option. However, if all dependencies of a job are filtered, then that job will not be executed either.
   */
  requires?: ListParameter;
  name?: StringParameter;
  context?: ListParameter;
  preSteps?: StepsParameter;
  postSteps?: StepsParameter;
  /**
   * {@link https://circleci.com/docs/2.0/configuration-reference/#filters} Filter workflow job's execution by branch or git tag.
   */
  filters?: FilterParameter;
  /**
   * {@link https://circleci.com/docs/2.0/configuration-reference/#matrix-requires-version-21} The matrix stanza allows you to run a parameterized job multiple times with different arguments.
   */
  matrix?: MatrixParameter;
  /**
   * An "approval" type job is a special job which pauses the workflow. This "job" is not defined outside of the workflow, you may enter any potential name for the job name. As long as the parameter of "type" is present and equal to "approval" this job will act as a placeholder that awaits user input to continue.
   */
  type?: approval;
}

export type approval = 'approval';

/**
 * Full Workflow Job parameter type
 */
export type WorkflowJobShape =
  | {
      [workflowJobName: StringParameter]: WorkflowJobContentsShape;
    }
  | string;

export type WorkflowJobContentsShape = WorkflowJobParametersShape | undefined;

/**
 * Workflow Job parameter output shape
 */
export interface WorkflowJobParametersShape {
  requires?: ListParameter;
  context?: ListParameter;
  type?: approval;
  filters?: FilterParameter;
  matrix?: WorkflowMatrixShape;
  [key: string]:
    | JobParameterTypes
    | WorkflowMatrixShape
    | undefined
    | AnyCommandShape[];
}

/**
 * A map of parameter names to every value the job should be called with
 */
export interface WorkflowMatrixShape {
  parameters: MatrixParameter;
}
