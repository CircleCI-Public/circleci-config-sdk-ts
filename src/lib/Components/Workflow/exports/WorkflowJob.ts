import { Component } from '../../index';
import { Job } from '../../Job';
import {
  WorkflowJobParameterSchema,
  WorkflowJobSchema,
} from '../types/WorkflowJob.types';

/**
 * Assign Parameters and Filters to a Job within a Workflow.
 * Utility class for assigning parameters to a job.
 * Should only be instantiated for specific use cases.
 * @see {@link Workflow.addJob} for general use.
 */
export class WorkflowJob extends Component {
  job: Job;
  parameters: WorkflowJobParameterSchema = {};
  constructor(job: Job, parameters?: WorkflowJobParameterSchema) {
    super();
    this.job = job;
    if (parameters) {
      this.parameters = parameters;
    }
  }
  generate(): WorkflowJobSchema {
    return {
      [this.job.name]: { ...this.parameters },
    };
  }
}
