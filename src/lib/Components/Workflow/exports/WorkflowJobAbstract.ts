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

  generateContents(): WorkflowJobContentsShape {
    let parameters: WorkflowJobParametersShape | undefined;

    if (this.parameters) {
      const { matrix, pre_steps, post_steps, ...jobParameters } =
        this.parameters;
      parameters = {
        ...jobParameters,
        'pre-steps': this.generateSteps(pre_steps),
        'post-steps': this.generateSteps(post_steps),
      };

      if (matrix) {
        parameters.matrix = {
          parameters: matrix,
        };
      }
    }

    return parameters;
  }

  get generableType(): GenerableType {
    return GenerableType.WORKFLOW_JOB;
  }

  private generateSteps(steps?: StepsParameter): AnyCommandShape[] | undefined {
    return steps?.map((step) => step.generate());
  }

  abstract get name(): string;
  abstract generate(): WorkflowJobShape;
}
