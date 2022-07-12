import { Job } from '@circleci/circleci-config-sdk';
import { UnknownJobShape } from '@circleci/circleci-config-sdk/lib/Components/Job';
import { JobDependencies } from '@circleci/circleci-config-sdk/lib/Components/Job/types/Job.types';
import { CustomParametersList } from '@circleci/circleci-config-sdk/lib/Components/Parameters';
import { JobParameterLiteral } from '@circleci/circleci-config-sdk/lib/Components/Parameters/types/CustomParameterLiterals.types';
import {
  CustomCommand,
  ReusableExecutor,
  ParameterizedJob,
} from '@circleci/circleci-config-sdk/lib/Components/Reusable';
import {
  GenerableType,
  ParameterizedComponent,
} from '@circleci/circleci-config-sdk/lib/Config/exports/Mapping';
import { parseGenerable } from '../../../Config/exports/Parsing';
import { parseSteps } from '../../Commands/parsers';
import { parseExecutor } from '../../Executors/parsers';
import { parseParameterList } from '../../Parameters/parsers';

/**
 * Parse a config's list of jobs into a list of Job instances.
 *
 * @param jobListIn - The high level list of jobs to be parsed
 * @param customCommands - The reference list of custom commands to be used when parsing reusable command steps
 * @param reusableExecutors - The reference list of reusable executors to be used
 * @returns A list of jobs
 * @throws Error if a job is not valid
 */
export function parseJobList(
  jobListIn: { [key: string]: unknown },
  customCommands?: CustomCommand[],
  reusableExecutors?: ReusableExecutor[],
): Job[] {
  return Object.entries(jobListIn).map(([name, args]) =>
    parseJob(name, args, customCommands, reusableExecutors),
  );
}

/**
 * Parse a single job into a Job instance.
 * ParameterizedJobs are assumed if `jobIn` contains the parameter key.
 *
 * @param name - The name of the job.
 * @param jobIn - The job to be parsed.
 * @param customCommands - The reference list of custom commands to be used for parsing reusable command steps.
 * @param reusableExecutors - The reference list of reusable executors to be used.
 * @returns A generic or parameterized job.
 * @throws Error if the job is not valid.
 */
export function parseJob(
  name: string,
  jobIn: unknown,
  customCommands?: CustomCommand[],
  reusableExecutors?: ReusableExecutor[],
): Job {
  return parseGenerable<UnknownJobShape, Job, JobDependencies>(
    GenerableType.JOB,
    jobIn,
    (_, { executor, steps, parametersList }) => {
      if (parametersList) {
        return new ParameterizedJob(name, executor, parametersList, steps);
      }

      return new Job(name, executor, steps);
    },
    (jobArgs) => {
      let parametersList;

      const executor = parseExecutor(jobArgs, reusableExecutors);
      const steps = parseSteps(jobArgs.steps, customCommands);

      if (jobArgs.parameters) {
        parametersList = parseParameterList(
          jobArgs.parameters,
          ParameterizedComponent.JOB,
        ) as CustomParametersList<JobParameterLiteral>;
      }

      return { executor, steps, parametersList };
    },
    name,
  );
}
