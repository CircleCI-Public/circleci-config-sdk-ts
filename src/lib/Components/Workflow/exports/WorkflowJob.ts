import { Component } from '../../index';
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
export class WorkflowJob extends Component {
  job: Job;
  parameters: WorkflowJobParameters = {};
  constructor(job: Job, parameters?: WorkflowJobParameters) {
    super();
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
}
