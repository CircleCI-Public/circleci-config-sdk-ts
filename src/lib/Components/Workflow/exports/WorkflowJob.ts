import { GenerableType } from '../../../Config/types/Config.types';
import { Generable } from '../../index';
import { Job } from '../../Job/exports/Job';
import {
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
export class WorkflowJob implements Generable {
  job: Job;
  parameters: WorkflowJobParameters = {};
  constructor(job: Job, parameters?: WorkflowJobParameters) {
    this.job = job;
    if (parameters) {
      this.parameters = parameters;
    }
  }
  generate(): WorkflowJobShape {
    const { matrix, ...jobParameters } = this.parameters;
    const parameters: WorkflowJobParametersShape = { ...jobParameters };

    if (matrix) {
      parameters.matrix = {
        parameters: matrix,
      };
    }

    return {
      [this.job.name]: parameters,
    };
  }

  get generableType(): GenerableType {
    return GenerableType.WORKFLOW_JOB;
  }
}
