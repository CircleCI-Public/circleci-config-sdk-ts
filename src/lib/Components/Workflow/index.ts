import { Generable } from '..';
import { GenerableType } from '../../Config/exports/Mapping';
import { Job } from '../Job';
import { When } from '../Logic/exports/When';
import { WorkflowJob } from './exports/WorkflowJob';
import { WorkflowsShape } from './types/Workflow.types';
import {
  WorkflowJobParameters,
  WorkflowJobShape,
} from './types/WorkflowJob.types';

/**
 * A workflow is a set of rules for defining a collection of jobs and their run order.
 */
export class Workflow implements Generable {
  /**
   * The name of the Workflow.
   */
  name: string;

  /**
   * The jobs to execute when this Workflow is triggered.
   */
  jobs: WorkflowJob[] = [];

  /**
   * The conditional statement that will be evaluated to determine whether to trigger this workflow.
   */
  when?: When;

  /**
   * Instantiate a Workflow
   * @param name - Name your workflow. Must be unique.
   * @param jobs - A list of jobs to be executed as part of your Workflow.
   */
  constructor(name: string, jobs?: Array<Job | WorkflowJob>, when?: When) {
    this.name = name;
    this.when = when;

    if (jobs) {
      this.jobs = jobs.map((job) =>
        job instanceof Job ? new WorkflowJob(job) : job,
      );
    }
  }
  /**
   * Generate Workflow Shape.
   * @returns The generated JSON for the Workflow.
   */
  generate(): unknown {
    const generatedWorkflowJobs: WorkflowJobShape[] = [];
    this.jobs.forEach((job) => {
      generatedWorkflowJobs.push(job.generate() as WorkflowJobShape); //Double check this
    });
    return {
      [this.name]: {
        jobs: generatedWorkflowJobs,
      },
    } as WorkflowsShape;
  }

  /**
   * Add a Job to the current Workflow. Chainable
   */
  addJob(job: Job, parameters?: WorkflowJobParameters): this {
    this.jobs.push(new WorkflowJob(job, parameters));
    return this;
  }

  get generableType(): GenerableType {
    return GenerableType.WORKFLOW;
  }
}

export { WorkflowJob };
