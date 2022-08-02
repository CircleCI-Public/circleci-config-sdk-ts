import * as CircleCI from '@circleci/circleci-config-sdk';
import { parseGenerable } from '../../../Config/exports/Parsing';
import { parseSteps } from '../../Commands/parsers';
import { parseExecutor } from '../../Executors/parsers';
import { parseParameterList } from '../../Parameters/parsers';

/**
 * Parse a config's list of jobs into a list of Job instances.
 *
 * @param jobListIn - The high level list of jobs to be parsed
 * @param ReusableCommands - The reference list of custom commands to be used when parsing reusable command steps
 * @param reusableExecutors - The reference list of reusable executors to be used
 * @returns A list of jobs
 * @throws Error if a job is not valid
 */
export function parseJobList(
  jobListIn: { [key: string]: unknown },
  ReusableCommands?: CircleCI.reusable.ReusableCommand[],
  reusableExecutors?: CircleCI.reusable.ReusableExecutor[],
): CircleCI.Job[] {
  return Object.entries(jobListIn).map(([name, args]) =>
    parseJob(name, args, ReusableCommands, reusableExecutors),
  );
}

/**
 * Parse a single job into a Job instance.
 * ParameterizedJobs are assumed if `jobIn` contains the parameter key.
 *
 * @param name - The name of the job.
 * @param jobIn - The job to be parsed.
 * @param ReusableCommands - The reference list of custom commands to be used for parsing reusable command steps.
 * @param reusableExecutors - The reference list of reusable executors to be used.
 * @returns A generic or parameterized job.
 * @throws Error if the job is not valid.
 */
export function parseJob(
  name: string,
  jobIn: unknown,
  ReusableCommands?: CircleCI.reusable.ReusableCommand[],
  reusableExecutors?: CircleCI.reusable.ReusableExecutor[],
): CircleCI.Job {
  return parseGenerable<
    CircleCI.types.job.UnknownJobShape,
    CircleCI.Job,
    CircleCI.types.job.JobDependencies
  >(
    CircleCI.mapping.GenerableType.JOB,
    jobIn,
    (_, { executor, steps, parametersList }) => {
      if (parametersList) {
        return new CircleCI.reusable.ParameterizedJob(
          name,
          executor,
          parametersList,
          steps,
        );
      }

      return new CircleCI.Job(name, executor, steps);
    },
    (jobArgs) => {
      let parametersList;

      const executor = parseExecutor(jobArgs, reusableExecutors);
      const steps = parseSteps(jobArgs.steps, ReusableCommands);

      if (jobArgs.parameters) {
        parametersList = parseParameterList(
          jobArgs.parameters,
          CircleCI.mapping.ParameterizedComponent.JOB,
        ) as CircleCI.parameters.CustomParametersList<CircleCI.types.parameter.literals.JobParameterLiteral>;
      }

      return { executor, steps, parametersList };
    },
    name,
  );
}
