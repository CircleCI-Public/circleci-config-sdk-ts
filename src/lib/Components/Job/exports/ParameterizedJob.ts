import { JobContentShape } from '../types/Job.types';
import { Command } from '../../Commands/exports/Command';
import { Executor } from '../../Executor/exports/Executor';
import { CustomParametersList, CustomParametersShape } from '../../Parameters';
import { ParameterizedComponent } from '../../Parameters/exports/ParameterizedComponent';
import { JobParameterLiteral } from '../../Parameters/types/CustomParameterLiterals.types';
import { Job } from '..';
/**
 * Parameterized are a type of Job which defines parameters it can accept.
 * {@label STATIC_2.1}
 */
class ParameterizedJob
  extends Job
  implements ParameterizedComponent<JobParameterLiteral>
{
  parameters: CustomParametersList<JobParameterLiteral>;

  constructor(
    name: string,
    executor: Executor,
    parameters?: CustomParametersList<JobParameterLiteral>,
    steps?: Command[],
  ) {
    super(name, executor, steps);
    this.parameters = parameters || new CustomParametersList();
  }

  generateJobContents(): ParameterizedJobContents {
    return {
      parameters: this.parameters.generate(),
      ...super.generateJobContents(),
    };
  }

  defineParameter(
    name: string,
    type: JobParameterLiteral,
    defaultValue?: unknown,
    description?: string,
    enumValues?: string[],
  ): ParameterizedJob {
    this.parameters.define(name, type, defaultValue, description, enumValues);

    return this;
  }
}

export type ParameterizedJobContents = JobContentShape & {
  parameters: CustomParametersShape;
};

export { ParameterizedJob };
