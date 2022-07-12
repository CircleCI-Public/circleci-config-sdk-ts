import { OrbRef } from '../../../Orb/exports/OrbRef';
import { Job } from '../../Job';
import { JobParameterLiteral } from '../../Parameters/types/CustomParameterLiterals.types';
import {
  WorkflowJobParameters,
  WorkflowJobShape,
} from '../types/WorkflowJob.types';
import { WorkflowJobAbstract } from './WorkflowJobAbstract';

/**
 * Assign Parameters and Filters to a Job within a Workflow.
 * Utility class for assigning parameters to a job.
 * Should only be instantiated for specific use cases.
 * @see {@link Workflow.addJob} for general use.
 */
export class WorkflowJob extends WorkflowJobAbstract {
  job: Job | OrbRef<JobParameterLiteral>;

  constructor(
    job: Job | OrbRef<JobParameterLiteral>,
    parameters?: Exclude<WorkflowJobParameters, 'type'>,
  ) {
    super(parameters);
    this.job = job;
  }

  generate(flatten?: boolean): WorkflowJobShape {
    if (this.parameters === undefined) {
      return this.job.name;
    }

    return {
      [this.job.name]: this.generateContents(flatten),
    };
  }

  get name(): string {
    return this.job.name;
  }
}
