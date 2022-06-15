import { GenerableType } from '../../../Config/exports/Mapping';
import { Generable } from '../../index';
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
      const { matrix, ...jobParameters } = this.parameters;
      parameters = { ...jobParameters };

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

  abstract generate(ctx?: GenerableType): WorkflowJobShape;
}
