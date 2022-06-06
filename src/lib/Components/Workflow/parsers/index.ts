import { Workflow } from '..';
import { Validator } from '../../../Config';
import { GenerableType } from '../../../Config/exports/Mapping';
import {
  parseGenerable as parseGenerable,
  errorParsing,
} from '../../../Config/exports/Parsing';
import { Job } from '../../Job';
import { WorkflowJob } from '../exports/WorkflowJob';
import {
  UnknownWorkflowJobShape,
  UnknownWorkflowShape,
  WorkflowDependencies,
} from '../types';

/**
 * Parse a workflow's job reference.
 * Each job referenced by a workflow job must exist in the jobs list.
 * @param name - name of the workflow job.
 * @param workflowJobIn - the workflow job object to be parsed.
 * @param jobs - a list of reference jobs to be used when parsing steps.
 * @returns A workflow job.
 * @throws Error if the workflow job's reference is not in the job list.
 */
export function parseWorkflowJob(
  name: string,
  workflowJobIn: unknown,
  jobs: Job[],
): WorkflowJob {
  return parseGenerable<UnknownWorkflowJobShape, WorkflowJob>(
    GenerableType.WORKFLOW_JOB,
    workflowJobIn,
    (workflowJobArgs) => {
      const job = jobs.find((c) => c.name === name);

      if (job) {
        return new WorkflowJob(job, workflowJobArgs);
      }

      throw errorParsing(`Job ${name} not found in config`);
    },
    undefined,
    name,
  );
}

/**
 * Parse a single workflow.
 * @param name - name of the workflow.
 * @param workflowIn - the workflow to be parsed.
 * @param jobs - a list of reference jobs to be used when parsing workflow jobs.
 * @returns A workflow.
 * @throws Error if the workflow is not valid.
 */
export function parseWorkflow(
  name: string,
  workflowIn: unknown,
  jobs: Job[],
): Workflow {
  return parseGenerable<UnknownWorkflowShape, Workflow, WorkflowDependencies>(
    GenerableType.WORKFLOW,
    workflowIn,
    (workflowArgs, { jobList }) => {
      if (Validator.validateGenerable(GenerableType.WORKFLOW, workflowIn)) {
        return new Workflow(name, jobList);
      }
    },
    (workflowArgs) => {
      const jobList = workflowArgs.jobs.map((job) => {
        const [name, args] = Object.entries(job)[0];

        return parseWorkflowJob(name, args, jobs);
      });

      return { jobList };
    },
    name,
  );
}

/**
 * Parse a config's list of workflows.
 * @param workflowIn - the workflow to be parsed.
 * @param jobs - a list of reference jobs to be used when parsing workflow jobs.
 * @returns A list of workflow.
 * @throws Error if any workflow fails to parse.
 */
export function parseWorkflowList(
  workflowsIn: unknown,
  jobs: Job[],
): Workflow[] {
  const workflowList = Object.entries(
    workflowsIn as { [name: string]: UnknownWorkflowShape },
  ).map(([name, workflow]) => parseWorkflow(name, workflow, jobs));

  return workflowList;
}
