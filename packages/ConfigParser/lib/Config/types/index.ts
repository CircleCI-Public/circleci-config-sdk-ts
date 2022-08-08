import * as CircleCI from '@circleci/circleci-config-sdk';
import * as mapping from './Mapping.types';
import * as validator from './Validator.types';

/**
 * Selected config version
 */
export type ConfigVersion = 2 | 2.1;

/**
 * Orb import object
 */
export type ConfigOrbImport = Record<string, string>;

/**
 * CircleCI configuration object
 */
export type CircleCIConfigObject = {
  version: ConfigVersion;
  jobs?: CircleCI.Job[];
  executors?: CircleCI.reusable.ReusableExecutor[];
  commands?: CircleCI.reusable.ReusableCommand[];
  workflows?: CircleCI.Workflow[];
  orbs?: CircleCI.orb.OrbImport[];
};

/**
 * Generated Shape of the CircleCI config.
 */
export type CircleCIConfigShape = {
  version: ConfigVersion;
  setup: boolean;
  parameters?: Record<string, CircleCI.types.parameter.ParameterShape>;
  executors?: CircleCI.types.executors.reusable.ReusableExecutorsShape;
  orbs?: CircleCI.types.orb.OrbImportsShape;
  jobs: CircleCI.types.job.JobsShape;
  commands?: CircleCI.types.command.ReusableCommandShape;
  workflows: CircleCI.types.workflow.WorkflowsShape;
};

export type UnknownConfigShape = {
  setup: boolean;
  executors?: Record<string, unknown>;
  jobs: Record<string, unknown>;
  commands?: Record<string, unknown>;
  parameters?: Record<string, unknown>;
  workflows: Record<string, unknown>;
};

export type ConfigDependencies = {
  jobList: CircleCI.Job[];
  workflows: CircleCI.Workflow[];
  executorList?: CircleCI.reusable.ReusableExecutor[];
  commandList?: CircleCI.reusable.ReusableCommand[];
  parameterList?: CircleCI.parameters.CustomParametersList<CircleCI.types.parameter.literals.AnyParameterLiteral>;
};

export { validator, mapping };
