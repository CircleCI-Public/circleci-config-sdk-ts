import { Generable } from '..';
import { GenerableType } from '../../Config/exports/Mapping';
import { Job } from '../Job';
import { When } from '../Logic';
import { Conditional } from '../Logic/exports/Conditional';
import { WorkflowJob } from './exports/WorkflowJob';
import { WorkflowJobAbstract } from './exports/WorkflowJobAbstract';
import { WorkflowJobApproval } from './exports/WorkflowJobApproval';
import { WorkflowsShape } from './types/Workflow.types';
import { WorkflowJobParameters } from './types/WorkflowJob.types';

/**
 * A workflow is a set of rules for defining a collection of jobs and their run order.
 */
export class Workflow implements Generable, Conditional {
  /**
   * The name of the Workflow.
   */
  name: string;

  /**
   * The jobs to execute when this Workflow is triggered.
   */
  jobs: WorkflowJobAbstract[] = [];

  /**
   * The conditional statement that will be evaluated to determine whether to trigger this workflow.
   */
  when?: When;

  /**
   * Instantiate a Workflow
   * @param name - Name your workflow. Must be unique.
   * @param jobs - A list of jobs to be executed as part of your Workflow.
   */
  constructor(
    name: string,
    jobs?: Array<Job | WorkflowJobAbstract>,
    when?: When,
  ) {
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
  generate(): WorkflowsShape {
    const generatedWorkflowJobs = this.jobs.map((job) => {
      return job.generate();
    });

    const generatedWhen = this.when?.generate();

    return {
      [this.name]: {
        when: generatedWhen,
        jobs: generatedWorkflowJobs,
      },
    };
  }

  /**
   * Add a Job to the current Workflow. Chainable
   */
  addJob(job: Job, parameters?: WorkflowJobParameters): this {
    this.jobs.push(new WorkflowJob(job, parameters));
    return this;
  }

  /**
   * Add a Approval to the current Workflow. Chainable
   */
  addJobApproval(name: string, parameters?: WorkflowJobParameters): this {
    this.jobs.push(new WorkflowJobApproval(name, parameters));
    return this;
  }

  get generableType(): GenerableType {
    return GenerableType.WORKFLOW;
  }
}

export { WorkflowJob };
