import { OrbRef } from '../../../Orb/exports/OrbRef';
import { AnyCommandShape } from '../../Commands/types/Command.types';
import { Job } from '../../Job';
import { StepsParameter } from '../../Parameters/types';
import { JobParameterLiteral } from '../../Parameters/types/CustomParameterLiterals.types';
import {
  WorkflowJobContentsShape,
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
  pre_steps?: StepsParameter;
  post_steps?: StepsParameter;

  constructor(
    job: Job | OrbRef<JobParameterLiteral>,
    parameters?: Exclude<WorkflowJobParameters, 'type'>,
    pre_steps?: StepsParameter,
    post_steps?: StepsParameter,
  ) {
    super(parameters);
    this.job = job;
    this.pre_steps = pre_steps;
    this.post_steps = post_steps;
  }

  generateContents(flatten?: boolean): WorkflowJobContentsShape {
    return {
      ...super.generateContents(flatten),
      'pre-steps': this.generateSteps(this.pre_steps, flatten),
      'post-steps': this.generateSteps(this.post_steps, flatten),
    };
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

  private generateSteps(
    steps?: StepsParameter,
    flatten?: boolean,
  ): AnyCommandShape[] | undefined {
    return steps?.map((step) => step.generate(flatten));
  }
}
