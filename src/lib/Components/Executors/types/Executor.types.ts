import { DockerExecutorShape } from './DockerExecutor.types';
import { MachineExecutorShape } from './MachineExecutor.types';
import { MacOSExecutorShape } from './MacOSExecutor.types';
import { WindowsExecutorShape } from './WindowsExecutor.types';

export type UnknownExecutorShape = {
  resource_class: string;
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
export type ExecutorLiteralUsage = ExecutorLiteral | 'executor';
