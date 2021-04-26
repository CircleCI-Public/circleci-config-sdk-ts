import { Command, CommandSchema } from "../Components/Commands/index.types"
import { Job, Workflow } from "../Components"
import { Executor } from "../Components/Executor"
import { ExecutorType, ExectorSchema } from "../Components/Executor/index.types"
import { JobSchema } from "../Components/Job/index.types"
import { WorkflowFilterSchema, WorkflowMatrixSchema, WorkflowSchema } from "../Components/Workflow/index.types"

export type ConfigVersion = 2 | 2.1;
export interface ConfigOrbImport {
  orbAlias: string;
  orbImport: string;
}

export interface CircleCIConfigObject {
  version: ConfigVersion;
  jobs?: Job[];
  executors?: Executor[];
  commands?: Command[];
  workflows?: Workflow[];
}

export interface CircleCIConfigSchema {
  version: ConfigVersion;
  orbs?: ConfigOrbImport[];
  jobs: JobSchema;
  executors?: ExectorSchema;
  commands?: CommandSchema;
  workflows: WorkflowSchema;
}

export type EnumParameter = string[]

export type ParameterTypes =
  | string
  | string[]
  | boolean
  | number
  | ExecutorType // executor
  | Command[] // steps
  | EnumParameter // enum
  | Map<string, string> // Environment key value pairs
  | WorkflowMatrixSchema // Matrix parameters for Workflow jobs
  | WorkflowFilterSchema // Workflow job filter parameters
  | undefined
