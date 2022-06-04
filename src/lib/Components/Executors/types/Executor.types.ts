import { GenerableType } from '../../../Config/exports/Mapping';
import { Executor } from '../exports/Executor';
import { ReusableExecutor } from '../exports/ReusableExecutor';
import { DockerExecutorShape } from './DockerExecutor.types';
import { MachineExecutorShape } from './MachineExecutor.types';
import { MacOSExecutorShape } from './MacOSExecutor.types';
import { WindowsExecutorShape } from './WindowsExecutor.types';

export type UnknownExecutorShape = {
  resource_class: AnyResourceClass;
  [key: string]: unknown;
};

/**
 * The executor output shapes for YAML string
 */
export type ExecutorShape =
  | DockerExecutorShape
  | MachineExecutorShape
  | MacOSExecutorShape
  | WindowsExecutorShape;

/**
 * The valid resource classes found for an executor object
 */
export type AnyResourceClass =
  | 'small'
  | 'medium'
  | 'medium+'
  | 'large'
  | 'xlarge'
  | '2xlarge'
  | '2xlarge+';

/**
 * The valid executors found on an executor object
 * Windows is covered by the machine literal
 */
export type ExecutorLiteral = 'docker' | 'machine' | 'macos';

/**
 * The valid executors found on an object referencing an executor
 */
export type ExecutorUsageLiteral = ExecutorLiteral | 'executor';

export type UnknownParameterized = {
  parameters?: { [key: string]: unknown };
};

export type ReusableExecutorDefinition = {
  [key: string]: UnknownExecutorShape & UnknownParameterized;
};

export type ExecutorSubtypeMap = {
  [key in ExecutorUsageLiteral | 'windows']: {
    generableType: GenerableType;
    parse: (
      args: unknown,
      resourceClass: AnyResourceClass,
      reusableExecutors?: ReusableExecutor[],
    ) => Executor | ReusableExecutor;
  };
};
