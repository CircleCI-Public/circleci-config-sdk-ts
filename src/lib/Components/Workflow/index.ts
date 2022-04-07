import { ConfigValidator } from '../../Config/ConfigValidator';
import { GenerableType } from '../../Config/types/Config.types';
import { Job } from '../Job/exports/Job';
import { WorkflowJob } from './exports/WorkflowJob';
import { WorkflowShape } from './types/Workflow.types';
import {
  WorkflowJobParameters,
  WorkflowJobShape,
} from './types/WorkflowJob.types';

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
    } as WorkflowShape;
  }

  /**
   * Add a Job to the current Workflow. Chainable
   */
  addJob(job: Job, parameters?: WorkflowJobParameters): this {
    this.jobs.push(new WorkflowJob(job, parameters));
    return this;
  }
}

export function parseWorkflowJob(
  name: string,
  workflowJobIn: unknown,
  jobs: Job[],
): WorkflowJob {
  const workflowJobArgs = workflowJobIn as {
    requires?: string[];
    parameters?: { [key: string]: unknown };
    name?: string;
    type?: 'approval';
    // 'pre-steps'?: { [key: string]: unknown }[];
    // 'post-steps'?: { [key: string]: unknown }[];
  };

  const job = jobs.find((c) => c.name === name);

  if (job) {
    return new WorkflowJob(job, workflowJobArgs);
  }

  throw new Error(
    `Could not parse workflow job - Job ${name} not found in config`,
  );
}

type WorkflowInShape = {
  jobs: { [key: string]: unknown }[];
};

export function parseWorkflow(
  name: string,
  workflowIn: unknown,
  jobs: Job[],
): Workflow {
  if (ConfigValidator.validateGenerable(GenerableType.WORKFLOW, workflowIn)) {
    const workflowArgs = workflowIn as WorkflowInShape;

    const jobList = workflowArgs.jobs.map((job) => {
      const [name, args] = Object.entries(job)[0];

      return parseWorkflowJob(name, args, jobs);
    });

    return new Workflow(name, jobList);
  }

  throw new Error('Could not parse job - provided input was invalid');
}

export function parseWorkflowList(
  workflowsIn: unknown,
  jobs: Job[],
): Workflow[] {
  return Object.entries(workflowsIn as { [name: string]: WorkflowInShape }).map(
    ([name, workflow]) => parseWorkflow(name, workflow, jobs),
  );
}
