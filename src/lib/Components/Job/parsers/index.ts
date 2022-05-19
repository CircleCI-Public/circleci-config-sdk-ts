import { Job, UnknownJobShape } from '..';
import {
  GenerableType,
  ParameterizedComponent,
} from '../../../Config/exports/Mapping';
import { Validator } from '../../../Config/exports/Validator';
import { CustomCommand } from '../../Commands/exports/Reusable/CustomCommand';
import { parseSteps } from '../../Commands/parsers';
import { ReusableExecutor } from '../../Executors';
import { parseExecutor } from '../../Executors/parsers';
import { CustomParametersList } from '../../Parameters';
import { parseParameterList } from '../../Parameters/parsers';
import { JobParameterLiteral } from '../../Parameters/types/CustomParameterLiterals.types';
import { ParameterizedJob } from '../exports/ParameterizedJob';

export function parseJobList(
  jobListIn: { [key: string]: unknown },
  custom_commands?: CustomCommand[],
  executors?: ReusableExecutor[],
): Job[] {
  return Object.entries(jobListIn).map(([name, args]) =>
    parseJob(name, args, custom_commands, executors),
  );
}

export function parseJob(
  name: string,
  jobIn: unknown,
  customCommands?: CustomCommand[],
  reusableExecutors?: ReusableExecutor[],
): Job {
  if (Validator.validateGenerable(GenerableType.JOB, jobIn)) {
    const jobArgs = jobIn as UnknownJobShape;

    const exec = parseExecutor(jobArgs, reusableExecutors);
    const steps = parseSteps(jobArgs.steps, customCommands);

    if (exec) {
      if (jobArgs.parameters) {
        const parametersList = parseParameterList(
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
