import { Job } from '..';
import { Command } from '../../Commands/exports/Command';
import { CustomParametersList } from '../../Parameters';
import { Parameterized } from '../../Parameters/exports/Parameterized';
import { JobParameterLiteral } from '../../Parameters/types/CustomParameterLiterals.types';
import { AnyExecutor, ParameterizedJobContents } from '../types/Job.types';

/**
 * Parameterized jobs are a type of Job which defines the parameters it can accept.
 * This is the reusable alternative to the Job class, since parameters allow for
 * more control and recyclability to the workflow.
 */
class ParameterizedJob
  extends Job
  implements Parameterized<JobParameterLiteral>
{
  /**
   * The list of parameters this job can accept.
   */
  parameters: CustomParametersList<JobParameterLiteral>;

  constructor(
    name: string,
    executor: AnyExecutor,
    parameters?: CustomParametersList<JobParameterLiteral>,
    steps?: Command[],
  ) {
    super(name, executor, steps);
    this.parameters = parameters || new CustomParametersList();
  }

  /**
   * Generate the internal contents of this job.
   * @returns The job contents in it's generated shape.
   */
  generateContents(): ParameterizedJobContents {
    return {
      parameters: this.parameters.generate(),
      ...super.generateContents(),
    };
  }

  /**
   * Define another parameter that this job will be able to accept.
   * Chainable.
   * @param name - The name of the parameter.
   * @param type - The type of parameter being added to this job.
   * @param defaultValue - The default value of the parameter.
   * @param description - The description of the parameter.
   * @param enumValues - The list of possible values for the parameter. type must be set to 'enum'.
   *
   * @returns this instance.
   */
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

export { ParameterizedJob };
