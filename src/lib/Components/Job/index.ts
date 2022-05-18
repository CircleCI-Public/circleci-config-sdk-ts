import { commands, executor, parameters } from '../../..';
import {
  GenerableType,
  ParameterizedComponent,
} from '../../Config/exports/Mapping';
import { Validator } from '../../Config/exports/Validator';
import { CustomCommand } from '../Commands/exports/Reusable';
import { ReusableExecutor } from '../Executor';
import { CustomParametersList } from '../Parameters';
import { JobParameterLiteral } from '../Parameters/types/CustomParameterLiterals.types';
import { Job, UnknownJobShape } from './exports/Job';
import { ParameterizedJob } from './exports/ParameterizedJob';

export { Job, ParameterizedJob };

export function parseJobs(
  jobListIn: { [key: string]: unknown },
  custom_commands?: CustomCommand[],
  executors?: ReusableExecutor[],
): Job[] {
  return Object.entries(jobListIn).map(([name, args]) =>
    parseJob(name, args, custom_commands, executors),
  );
}

// TODO: Handle parameterized job
export function parseJob(
  name: string,
  jobIn: unknown,
  customCommands?: CustomCommand[],
  executors?: ReusableExecutor[],
): Job {
  if (Validator.validateGenerable(GenerableType.JOB, jobIn)) {
    const jobArgs = jobIn as UnknownJobShape;

    const exec = executor.parse(jobArgs, executors);
    const steps = commands.parseSteps(jobArgs.steps, customCommands);

    if (exec) {
      if (jobArgs.parameters) {
        const parametersList = parameters.parseList(
          jobArgs.parameters,
          ParameterizedComponent.JOB,
        ) as CustomParametersList<JobParameterLiteral>;

        return new ParameterizedJob(name, exec, parametersList, steps);
      } else {
        return new Job(name, exec, steps);
      }
    } else {
      throw new Error('Could not parse job - could not parse executor');
    }
  }

  throw new Error('Could not parse job - provided input was invalid');
}
