import { Job, JobContentSchema } from '.';
import { Command } from '../Commands/Command';
import { AbstractExecutor } from '../Executor/Executor';

export type JobParameterType = 'string' | 'integer' | 'boolean' | 'enum';

export type ParameterMap = {
  [key: string]: { default: unknown; type: JobParameterType; enum?: string[] };
};
/**
 * Parameterized are a type of Job which defines parameters it can accept.
 */
class ParameterizedJob extends Job {
  parameters: ParameterMap;

  constructor(
    name: string,
    executor: AbstractExecutor,
    parameters: ParameterMap,
    steps?: Command[],
  ) {
    super(name, executor, steps);
    this.parameters = parameters;
  }

  generateJobContents(): ParameterizedJobContents {
    return {
      parameters: this.parameters,
      ...super.generateJobContents(),
    };
  }
}

export type ParameterizedJobContents = JobContentSchema & {
  parameters: ParameterMap;
};

export { ParameterizedJob };
