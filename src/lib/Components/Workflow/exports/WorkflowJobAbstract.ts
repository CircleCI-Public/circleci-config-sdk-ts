import { GenerableType } from '../../../Config/exports/Mapping';
import { AnyCommandShape } from '../../Commands/types/Command.types';
import { Generable } from '../../index';
import { StepsParameter } from '../../Parameters/types';
import {
  WorkflowJobContentsShape,
  WorkflowJobParameters,
  WorkflowJobParametersShape,
  WorkflowJobShape,
} from '../types/WorkflowJob.types';

/**
 * Assign Parameters and Filters to a Job within a Workflow.
 * Utility class for assigning parameters to a job.
 * Should only be instantiated for specific use cases.
 * @see {@link Workflow.addJob} for general use.
 */
export abstract class WorkflowJobAbstract implements Generable {
  parameters?: WorkflowJobParameters = {};

  constructor(parameters?: WorkflowJobParameters) {
    this.parameters = parameters;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  generateContents(flatten?: boolean): WorkflowJobContentsShape {
    let parameters: WorkflowJobParametersShape | undefined;

    if (this.parameters) {
      const { matrix, preSteps, postSteps, ...jobParameters } = this.parameters;
      parameters = jobParameters;

      if (matrix) {
        parameters.matrix = {
          parameters: matrix,
        };
      }

      if (preSteps) {
        parameters['pre-steps'] = this.generateSteps(preSteps, flatten);
      }
      if (postSteps) {
        parameters['post-steps'] = this.generateSteps(postSteps, flatten);
      }
    }

    return parameters;
  }

  get generableType(): GenerableType {
    return GenerableType.WORKFLOW_JOB;
  }

  private generateSteps(
    steps?: StepsParameter,
    flatten?: boolean,
  ): AnyCommandShape[] | undefined {
    return steps?.map((step) => step.generate(flatten));
  }

  abstract get name(): string;
  abstract generate(flatten?: boolean): WorkflowJobShape;
}
