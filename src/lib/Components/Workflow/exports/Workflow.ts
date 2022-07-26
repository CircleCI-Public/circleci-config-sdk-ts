import { Generable } from '../..';
import { GenerableType } from '../../../Config/exports/Mapping';
import { Command } from '../../Commands/exports/Command';
import { Job } from '../../Job';
import { When } from '../../Logic';
import { Conditional } from '../../Logic/exports/Conditional';
import {
  WorkflowJobParameters,
  WorkflowsContentsShape,
  WorkflowsShape,
} from '../types';
import { WorkflowJob } from './WorkflowJob';
import { WorkflowJobAbstract } from './WorkflowJobAbstract';
import { WorkflowJobApproval } from './WorkflowJobApproval';

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
  generate(flatten?: boolean): WorkflowsShape {
    return {
      [this.name]: this.generateContents(flatten),
    };
  }

  generateContents(flatten?: boolean): WorkflowsContentsShape {
    const generatedWorkflowJobs = this.jobs.map((job) => {
      return job.generate(flatten);
    });

    const generatedWhen = this.when?.generate();

    return {
      when: generatedWhen,
      jobs: generatedWorkflowJobs,
    };
  }

  /**
   * Add a Job to the current Workflow. Chainable
   */
  addJob(
    job: Job,
    parameters?: WorkflowJobParameters,
    pre_steps?: Command[],
    post_steps?: Command[],
  ): this {
    this.jobs.push(new WorkflowJob(job, parameters, pre_steps, post_steps));
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
