import { Scalar, stringify } from 'yaml';
import { version as SDKVersion } from '../../package-version.json';
import { Generable } from '../Components';
import { CustomCommandShape } from '../Components/Commands/types/Command.types';
import { ReusableExecutor } from '../Components/Executors/exports/ReusableExecutor';
import { ReusableExecutorsShape } from '../Components/Executors/types/ReusableExecutor.types';
import { Job } from '../Components/Job';
import { JobsShape } from '../Components/Job/types/Job.types';
import { CustomParametersList } from '../Components/Parameters';
import { Parameterized } from '../Components/Parameters/exports/Parameterized';
import { PipelineParameterLiteral } from '../Components/Parameters/types/CustomParameterLiterals.types';
import { CustomCommand } from '../Components/Reusable';
import { Workflow } from '../Components/Workflow/exports/Workflow';
import { WorkflowsShape } from '../Components/Workflow/types/Workflow.types';
import { OrbImport } from '../Orb/exports/OrbImport';
import { OrbImportsShape } from '../Orb/types/Orb.types';
import { GenerableType } from './exports/Mapping';
import { Validator } from './exports/Validator';
import { Pipeline } from './Pipeline';
import {
  CircleCIConfigObject,
  CircleCIConfigShape,
  ConfigVersion,
} from './types';

/**
 * A CircleCI configuration. Instantiate a new config and add CircleCI config elements.
 */
export class Config
  implements
    CircleCIConfigObject,
    Parameterized<PipelineParameterLiteral>,
    Generable
{
  /**
   * The version field is intended to be used in order to issue warnings for deprecation or breaking changes.
   */
  version: ConfigVersion = 2.1;
  /**
   * Reusable executors to be referenced from jobs.
   */
  executors?: ReusableExecutor[];
  /**
   * Jobs are collections of steps. All of the steps in the job are executed in a single unit, either within a fresh container or VM.
   */
  jobs: Job[] = [];
  /**
   * A command definition defines a sequence of steps as a map to be executed in a job, enabling you to reuse a single command definition across multiple jobs.
   */
  commands?: CustomCommand[];
  /**
   * A Workflow is comprised of one or more uniquely named jobs.
   */
  workflows: Workflow[] = [];
  /**
   * A parameter allows custom data to be passed to a pipeline.
   */
  parameters?: CustomParametersList<PipelineParameterLiteral>;
  /**
   * Access information about the current pipeline.
   */
  pipeline: Pipeline = new Pipeline();
  /**
   * Designates the config.yaml for use of CircleCI’s dynamic configuration feature.
   */
  setup: boolean;

  orbs?: OrbImport[];

  /**
   * Instantiate a new CircleCI config. Build up your config by adding components.
   * @param jobs - Instantiate with pre-defined Jobs.
   * @param workflows - Instantiate with pre-defined Workflows.
   * @param commands - Instantiate with pre-defined reusable Commands.
   */
  constructor(
    setup = false,
    jobs?: Job[],
    workflows?: Workflow[],
    executors?: ReusableExecutor[],
    commands?: CustomCommand[],
    parameters?: CustomParametersList<PipelineParameterLiteral>,
    orbs?: OrbImport[],
  ) {
    this.setup = setup;
    this.jobs = jobs || [];
    this.workflows = workflows || [];
    this.executors = executors;
    this.commands = commands;
    this.parameters = parameters;
    this.orbs = orbs;
  }

  /**
   * Add a Workflow to the current Config. Chainable
   * @param workflow - Injectable Workflow
   */
  addWorkflow(workflow: Workflow): this {
    this.workflows.push(workflow);
    return this;
  }

  /**
   * Add a Custom Command to the current Config. Chainable
   * @param command - Injectable command
   */
  addCustomCommand(command: CustomCommand): this {
    if (!this.commands) {
      this.commands = [command];
    } else {
      this.commands.push(command);
    }

    return this;
  }

  /**
   * Add a Workflow to the current Config. Chainable
   * @param workflow - Injectable Workflow
   */
  addReusableExecutor(executor: ReusableExecutor): this {
    if (!this.executors) {
      this.executors = [executor];
    } else {
      this.executors.push(executor);
    }

    return this;
  }

  /**
   * Add a Job to the current Config. Chainable
   * @param job - Injectable Job
   */
  addJob(job: Job): this {
    this.jobs.push(job);

    return this;
  }

  importOrb(orb: OrbImport): this {
    if (!this.orbs) {
      this.orbs = [orb];
    } else {
      this.orbs.push(orb);
    }

    return this;
  }

  /**
   * Define a pipeline parameter for the current Config. Chainable
   *
   * @param name - The name of the parameter
   * @param type - The type of parameter
   * @param defaultValue - The default value of the parameter
   * @param description - A description of the parameter
   * @param enumValues - An array of possible values for parameters of enum type
   */
  defineParameter(
    name: string,
    type: PipelineParameterLiteral,
    defaultValue?: unknown,
    description?: string,
    enumValues?: string[],
  ): Config {
    if (!this.parameters) {
      this.parameters = new CustomParametersList<PipelineParameterLiteral>();
    }

    this.parameters.define(name, type, defaultValue, description, enumValues);

    return this;
  }

  private prependVersionComment(source: string): string {
    const comment = `# This configuration has been automatically generated by the CircleCI Config SDK.
# For more information, see https://github.com/CircleCI-Public/circleci-config-sdk-ts
# SDK Version: ${SDKVersion}
`;
    return `${comment}\n${source}`;
  }

  /**
   * Export the CircleCI configuration as a YAML string.
   */
  generate(flatten?: boolean): string {
    const generatedWorkflows = generateList<WorkflowsShape>(
      this.workflows,
      {},
      flatten,
    );
    const generatedJobs = generateList<JobsShape>(this.jobs, {}, flatten);
    const generatedExecutors = generateList<ReusableExecutorsShape>(
      this.executors,
    );
    const generatedCommands = generateList<CustomCommandShape>(
      this.commands,
      undefined,
      flatten,
    );
    const generatedParameters = this.parameters?.generate();
    const generatedOrbs = generateList<OrbImportsShape>(this.orbs);

    const generatedConfig: CircleCIConfigShape = {
      version: this.version,
      setup: this.setup,
      parameters: generatedParameters,
      commands: generatedCommands,
      executors: generatedExecutors,
      jobs: generatedJobs,
      workflows: generatedWorkflows,
      orbs: generatedOrbs,
    };

    return this.prependVersionComment(
      stringify(generatedConfig as CircleCIConfigShape, {
        defaultStringType: Scalar.PLAIN,
        lineWidth: 0,
        minContentWidth: 0,
        doubleQuotedMinMultiLineLength: 999,
      }),
    );
  }

  get generableType(): GenerableType {
    return GenerableType.CONFIG;
  }
}

function generateList<Shape>(
  listIn?: Generable[],
  failSafe?: Shape,
  flatten?: boolean,
): Shape {
  if (!listIn) {
    return failSafe as Shape;
  }

  return Object.assign(
    {},
    ...listIn.map((generable) => {
      return generable.generate(flatten);
    }),
  );
}

export { Validator };
