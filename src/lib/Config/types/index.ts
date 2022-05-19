import { CustomCommandShape } from '../../Components/Commands/types/Command.types';
import { ReusableExecutorsShape } from '../../Components/Executors/types/ReusableExecutor.types';
import { Job } from '../../Components/Job';
import { JobShape } from '../../Components/Job/types/Job.types';
import { ParameterShape } from '../../Components/Parameters/types';
import { WorkflowShape } from '../../Components/Workflow/types/Workflow.types';
import { Workflow } from '../../Components/Workflow';
import * as validator from './Validator.types';
import * as mapping from './Mapping.types';
import { CustomCommand } from '../../Components/Reusable';
import { ReusableExecutor } from '../../Components/Executors/exports/ReusableExecutor';

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
  executors?: ReusableExecutorsShape;
  orbs?: ConfigOrbImport[];
  jobs: JobShape;
  commands?: CustomCommandShape;
  workflows: WorkflowShape;
};

export { validator, mapping };
