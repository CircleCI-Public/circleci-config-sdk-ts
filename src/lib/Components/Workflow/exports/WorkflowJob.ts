import { GenerableType } from '../../../Config/exports/Mapping';
import { Generable } from '../../index';
import { Job } from '../../Job';
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
  job?: Job;
  parameters?: WorkflowJobParameters = {};
  constructor(job?: Job, parameters?: WorkflowJobParameters) {
    this.job = job;
    this.parameters = parameters;
  }

  generate(): WorkflowJobShape {
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

    const jobName = this.job?.name || this.parameters?.name;

    if (
      (this.job === undefined && parameters?.type !== 'approval') ||
      jobName === undefined
    ) {
      throw new Error(
        'Cannot generate a Workflow Job without assigned Job reference',
      );
    }

    return {
      [jobName]: parameters,
    };
  }

  get generableType(): GenerableType {
    return GenerableType.WORKFLOW_JOB;
  }
}
