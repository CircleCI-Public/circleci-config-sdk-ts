import { Workflow } from '..';
import { Validator } from '../../../Config';
import { GenerableType } from '../../../Config/exports/Mapping';
import { Job } from '../../Job';
import { WorkflowJob } from '../exports/WorkflowJob';

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
  if (Validator.validateGenerable(GenerableType.WORKFLOW, workflowIn)) {
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
