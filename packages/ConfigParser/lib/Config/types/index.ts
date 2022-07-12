import { Job, Workflow } from '@circleci/circleci-config-sdk';
import { CustomCommandShape } from '@circleci/circleci-config-sdk/lib/Components/Commands/types/Command.types';
import { ReusableExecutorsShape } from '@circleci/circleci-config-sdk/lib/Components/Executors/types/ReusableExecutor.types';
import { JobsShape } from '@circleci/circleci-config-sdk/lib/Components/Job/types/Job.types';
import { CustomParametersList } from '@circleci/circleci-config-sdk/lib/Components/Parameters';
import { ParameterShape } from '@circleci/circleci-config-sdk/lib/Components/Parameters/types';
import { AnyParameterLiteral } from '@circleci/circleci-config-sdk/lib/Components/Parameters/types/CustomParameterLiterals.types';
import {
  ReusableExecutor,
  CustomCommand,
} from '@circleci/circleci-config-sdk/lib/Components/Reusable';
import { WorkflowsShape } from '@circleci/circleci-config-sdk/lib/Components/Workflow/types';
import { OrbImport } from '@circleci/circleci-config-sdk/lib/Orb';
import { OrbImportsShape } from '@circleci/circleci-config-sdk/lib/Orb/types/Orb.types';
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
  jobs?: Job[];
  executors?: ReusableExecutor[];
  commands?: CustomCommand[];
  workflows?: Workflow[];
  orbs?: OrbImport[];
};

/**
 * Generated Shape of the CircleCI config.
 */
export type CircleCIConfigShape = {
  version: ConfigVersion;
  setup: boolean;
  parameters?: Record<string, ParameterShape>;
  executors?: ReusableExecutorsShape;
  orbs?: OrbImportsShape;
  jobs: JobsShape;
  commands?: CustomCommandShape;
  workflows: WorkflowsShape;
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
  jobList: Job[];
  workflows: Workflow[];
  executorList?: ReusableExecutor[];
  commandList?: CustomCommand[];
  parameterList?: CustomParametersList<AnyParameterLiteral>;
};

export { validator, mapping };
