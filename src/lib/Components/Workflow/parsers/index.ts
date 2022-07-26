import { GenerableType } from '../../../Config/exports/Mapping';
import { errorParsing, parseGenerable } from '../../../Config/exports/Parsing';
import { OrbImport } from '../../../Orb';
import { parseOrbRef } from '../../../Orb/parsers';
import { parseSteps } from '../../Commands/parsers';
import { Job } from '../../Job';
import { Workflow } from '../exports/Workflow';
import { WorkflowJob } from '../exports/WorkflowJob';
import { WorkflowJobAbstract } from '../exports/WorkflowJobAbstract';
import { WorkflowJobApproval } from '../exports/WorkflowJobApproval';
import {
  UnknownWorkflowJobShape,
  UnknownWorkflowShape,
  WorkflowDependencies,
  WorkflowJobParameters,
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
  orbs?: OrbImport[],
): WorkflowJobAbstract {
  return parseGenerable<UnknownWorkflowJobShape, WorkflowJobAbstract>(
    GenerableType.WORKFLOW_JOB,
    workflowJobIn,
    (workflowJobArgs) => {
      let args = workflowJobArgs;
      let parsedPresteps, parsedPoststeps;

      if (args) {
        if ('pre-steps' in args) {
          const { 'pre-steps': steps, ...argsRestTemp } = args;
          parsedPresteps = steps
            ? parseSteps(steps, undefined, orbs)
            : undefined;
          args = argsRestTemp;
        }

        if ('post-steps' in args) {
          const { 'post-steps': steps, ...argsRestTemp } = args;
          parsedPoststeps = steps
            ? parseSteps(steps, undefined, orbs)
            : undefined;
          args = argsRestTemp;
        }
      }

      const parameters = args as WorkflowJobParameters | undefined;

      if (workflowJobArgs?.type === 'approval') {
        return new WorkflowJobApproval(name, parameters);
      }

      const job =
        parseOrbRef(name, 'jobs', orbs) || jobs.find((c) => c.name === name);

      if (job) {
        return new WorkflowJob(
          job,
          parameters,
          parsedPresteps,
          parsedPoststeps,
        );
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
  orbs?: OrbImport[],
): Workflow {
  return parseGenerable<UnknownWorkflowShape, Workflow, WorkflowDependencies>(
    GenerableType.WORKFLOW,
    workflowIn,
    (workflowArgs, { jobList }) => new Workflow(name, jobList),
    (workflowArgs) => {
      const jobList = workflowArgs.jobs.map((job) => {
        if (typeof job === 'string') {
          return parseWorkflowJob(job, undefined, jobs);
        }

        const [name, args] = Object.entries(job)[0];

        return parseWorkflowJob(name, args, jobs, orbs);
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
  orbs?: OrbImport[],
): Workflow[] {
  const workflowList = Object.entries(
    workflowsIn as { [name: string]: UnknownWorkflowShape },
  ).map(([name, workflow]) => parseWorkflow(name, workflow, jobs, orbs));

  return workflowList;
}
