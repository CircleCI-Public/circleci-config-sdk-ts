import { Job, UnknownJobShape } from '..';
import {
  GenerableType,
  ParameterizedComponent,
} from '../../../Config/exports/Mapping';
import { parseGenerable } from '../../../Config/exports/Parsing';
import { OrbImport } from '../../../Orb';
import { CustomCommand } from '../../Commands/exports/Reusable/CustomCommand';
import { parseSteps } from '../../Commands/parsers';
import { parseExecutor } from '../../Executors/parsers';
import { CustomParametersList } from '../../Parameters';
import { parseParameterList } from '../../Parameters/parsers';
import { JobParameterLiteral } from '../../Parameters/types/CustomParameterLiterals.types';
import { ReusableExecutor } from '../../Reusable';
import { ParameterizedJob } from '../exports/ParameterizedJob';
import { JobDependencies } from '../types/Job.types';

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
  orbs?: OrbImport[],
): Job[] {
  return Object.entries(jobListIn).map(([name, args]) =>
    parseJob(name, args, customCommands, reusableExecutors, orbs),
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
  orbs?: OrbImport[],
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

      const executor = parseExecutor(jobArgs, reusableExecutors, orbs);
      const steps = parseSteps(jobArgs.steps, customCommands, orbs);

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
