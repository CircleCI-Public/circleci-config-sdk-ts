import { ReusableCommandShape } from '../../Components/Commands/types/Command.types';
import { ReusableExecutor } from '../../Components/Executors/exports/ReusableExecutor';
import { ReusableExecutorsShape } from '../../Components/Executors/types/ReusableExecutor.types';
import { Job } from '../../Components/Job';
import { JobsShape } from '../../Components/Job/types/Job.types';
import { CustomParametersList } from '../../Components/Parameters';
import { ParameterShape } from '../../Components/Parameters/types';
import { AnyParameterLiteral } from '../../Components/Parameters/types/CustomParameterLiterals.types';
import { Workflow } from '../../Components/Workflow/exports/Workflow';
import { WorkflowsShape } from '../../Components/Workflow/types/Workflow.types';
import { OrbImport } from '../../Orb';
import { OrbImportsShape } from '../../Orb/types/Orb.types';
import { Generable } from '../../Components';
import { ReusableCommand } from '../../Components/Reusable';
import * as mapping from './Mapping.types';

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
  commands?: ReusableCommand[];
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
  commands?: ReusableCommandShape;
  workflows: WorkflowsShape;
};

export type UnknownConfigShape = {
  setup: boolean;
  orbs?: Record<string, unknown>;
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
  commandList?: ReusableCommand[];
  parameterList?: CustomParametersList<AnyParameterLiteral>;
};

export { mapping, Generable };
