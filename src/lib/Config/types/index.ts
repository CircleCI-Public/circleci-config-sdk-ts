import { CustomCommandShape } from '../../Components/Commands/types/Command.types';
import { ReusableExecutor } from '../../Components/Executors/exports/ReusableExecutor';
import { ReusableExecutorShape } from '../../Components/Executors/types/ReusableExecutor.types';
import { Job } from '../../Components/Job';
import { JobsShape } from '../../Components/Job/types/Job.types';
import { ParameterShape } from '../../Components/Parameters/types';
import { CustomCommand } from '../../Components/Reusable';
import { Workflow } from '../../Components/Workflow';
import { WorkflowShape } from '../../Components/Workflow/types/Workflow.types';
import * as mapping from './Mapping.types';
import * as validator from './Validator.types';

/**
 * Selected config version
 */
export type ConfigVersion = 2 | 2.1;

/**
 * Orb import object
 */
export type ConfigOrbImport = {
  orbAlias: string;
  orbImport: string;
};

/**
 * CircleCI configuration object
 */
export type CircleCIConfigObject = {
  version: ConfigVersion;
  jobs?: Job[];
  executors?: ReusableExecutor[];
  commands?: CustomCommand[];
  workflows?: Workflow[];
};

/**
 * Generated Shape of the CircleCI config.
 */
export type CircleCIConfigShape = {
  version: ConfigVersion;
  setup: boolean;
  parameters?: Record<string, ParameterShape>;
  executors?: ReusableExecutorShape;
  orbs?: ConfigOrbImport[];
  jobs: JobsShape;
  commands?: CustomCommandShape;
  workflows: WorkflowShape;
};

export type UnknownConfigShape = {
  setup: boolean;
  executors?: Record<string, unknown>;
  jobs: Record<string, unknown>;
  commands?: Record<string, unknown>;
  parameters?: Record<string, unknown>;
  workflows: Record<string, unknown>;
};

export { validator, mapping };
