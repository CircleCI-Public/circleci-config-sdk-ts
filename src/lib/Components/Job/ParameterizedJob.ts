import { Job, JobContentSchema } from '.';
import { Command } from '../Commands/Command';
import { AbstractExecutor } from '../Executor/Executor';
import { CustomParametersList, CustomParametersSchema } from '../Parameters';
import { ParameterizedComponent } from '../Parameters/ParameterizedComponent';
import { JobParameterLiteral } from '../Parameters/Parameters.types';
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
    executor: AbstractExecutor,
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

export type ParameterizedJobContents = JobContentSchema & {
  parameters: CustomParametersSchema;
};

export { ParameterizedJob };
