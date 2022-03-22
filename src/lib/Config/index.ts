import { Scalar, stringify as Stringify } from 'yaml';
import { version as SDKVersion } from '../../package-version.json';
import { CustomCommand } from '../Components/Commands/exports/Reusable';
import { CustomCommandShape } from '../Components/Commands/types/Command.types';
import { ReusableExecutor } from '../Components/Executor';
import { ReusableExecutorsShape } from '../Components/Executor/types/ReusableExecutor.types';
import { Job } from '../Components/Job';
import { JobShape } from '../Components/Job/types/Job.types';
import { CustomParametersList } from '../Components/Parameters';
import { Parameterized } from '../Components/Parameters/exports/Parameterized';
import { PipelineParameterLiteral } from '../Components/Parameters/types/CustomParameterLiterals.types';
import { ParameterShape } from '../Components/Parameters/types/Parameters.types';
import { Workflow } from '../Components/Workflow';
import { WorkflowShape } from '../Components/Workflow/types/Workflow.types';
import { ConfigValidator } from './ConfigValidator';
import { Pipeline } from './Pipeline';

/**
 * A CircleCI configuration. Instantiate a new config and add CircleCI config elements.
 */
export class Config
  implements CircleCIConfigObject, Parameterized<PipelineParameterLiteral>
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

  /**
   * ajv validation instance for this config.
   * accessible through getValidator()
   */
  private validator?: ConfigValidator;

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
  ) {
    this.setup = setup;
    this.jobs = jobs || [];
    this.workflows = workflows || [];
    this.executors = executors;
    this.commands = commands;
    this.parameters = parameters;
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
    // Abstract rules later
    this.jobs.push(job);
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
  stringify(): string {
    const generatedJobConfig: JobShape = {};
    this.jobs.forEach((job) => {
      Object.assign(generatedJobConfig, job.generate());
    });

    let generatedExecutorConfig: ReusableExecutorsShape | undefined = undefined;

    if (this.executors) {
      generatedExecutorConfig = Object.assign(
        {},
        ...this.executors.map((reusableExecutor) => {
          return {
            [reusableExecutor.name]: {
              parameters: reusableExecutor.parameters?.generate(),
              ...reusableExecutor.executor.generate(),
            },
          };
        }),
      );
    }

    let generatedCommands: CustomCommandShape | undefined = undefined;

    if (this.commands) {
      generatedCommands = {};
      this.commands.forEach((command) => {
        Object.assign(generatedCommands, command.generate());
      });
    }

    const generatedWorkflowConfig: WorkflowShape = {};
    this.workflows.forEach((workflow) => {
      Object.assign(generatedWorkflowConfig, workflow.generate());
    });

    const generatedParameters = this.parameters?.generate();

    const generatedConfig: CircleCIConfigShape = {
      version: this.version,
      setup: this.setup,
      parameters: generatedParameters,
      commands: generatedCommands,
      executors: generatedExecutorConfig,
      jobs: generatedJobConfig,
      workflows: generatedWorkflowConfig,
    };

    // Removes all of the "undefined" keys so they do not appear as null on the final config
    const cleanedConfig = JSON.parse(JSON.stringify(generatedConfig));

    return this.prependVersionComment(
      Stringify(cleanedConfig, {
        defaultStringType: Scalar.PLAIN,
        lineWidth: 0,
        minContentWidth: 0,
        doubleQuotedMinMultiLineLength: 999,
      }),
    );
  }

  /**
   * Get validation instance for this config.
   * @returns ajv validation
   */
  getValidator(): ConfigValidator {
    if (!this.validator) {
      this.validator = new ConfigValidator(this);
    }

    return this.validator;
  }
}

/**
 * Selected config version
 */
type ConfigVersion = 2 | 2.1;

/**
 * Orb import object
 */
type ConfigOrbImport = {
  orbAlias: string;
  orbImport: string;
};

/**
 * CircleCI configuration object
 */
type CircleCIConfigObject = {
  version: ConfigVersion;
  jobs?: Job[];
  commands?: CustomCommand[];
  workflows?: Workflow[];
};

/**
 * Generated Shape of the CircleCI config.
 */
type CircleCIConfigShape = {
  version: ConfigVersion;
  setup: boolean;
  parameters?: Record<string, ParameterShape>;
  executors?: ReusableExecutorsShape;
  orbs?: ConfigOrbImport[];
  jobs: JobShape;
  commands?: CustomCommandShape;
  workflows: WorkflowShape;
};
