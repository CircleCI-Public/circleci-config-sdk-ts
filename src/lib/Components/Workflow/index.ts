import { Job } from '../Job';
import {
  WorkflowJobParameters,
  WorkflowJobSchema,
  WorkflowSchema,
} from './Workflow';
import { WorkflowJob } from './WorkflowJob';

/**
 * A workflow is a set of rules for defining a collection of jobs and their run order.
 */
export class Workflow {
  /**
   * The name of the Workflow.
   */
  name: string;
  /**
   * The jobs to execute when this Workflow is triggered.
   */
  jobs: WorkflowJob[] = [];
  /**
   * Instantiate a Workflow
   * @param name - Name your workflow. Must be unique.
   * @param jobs - A list of jobs to be executed as part of your Workflow.
   */
  constructor(name: string, jobs?: Array<Job | WorkflowJob>) {
    this.name = name;

    if (jobs?.find((job: unknown) => job instanceof Job)) {
      jobs.forEach((job) => {
        this.jobs.push(new WorkflowJob(job as Job));
      });
    } else {
      this.jobs = (jobs as WorkflowJob[]) || [];
    }
  }
  /**
   * Generate Workflow schema.
   * @returns The generated JSON for the Workflow.
   */
  generate(): unknown {
    const generatedWorkflowJobs: WorkflowJobSchema[] = [];
    this.jobs.forEach((job) => {
      generatedWorkflowJobs.push(job.generate() as WorkflowJobSchema); //Double check this
    });
    return {
      [this.name]: {
        jobs: generatedWorkflowJobs,
      },
    } as WorkflowSchema;
  }

  /**
   * Add a Job to the current Workflow. Chainable
   */
  addJob(job: Job, parameters?: WorkflowJobParameters): this {
    this.jobs.push(new WorkflowJob(job, parameters));
    return this;
  }
}
