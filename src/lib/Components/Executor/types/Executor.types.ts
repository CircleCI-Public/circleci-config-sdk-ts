import { DockerExecutorShape } from './DockerExecutor.types';
import { MachineExecutorShape } from './MachineExecutor.types';
import { MacOSExecutorShape } from './MacOSExecutor.types';
import { ReusableExecutorShape } from './ReusableExecutor.types';
import { WindowsExecutorShape } from './WindowsExecutor.types';

/**
 * The executor output shapes for YAML string
 */
export type ExecutorShape =
  | DockerExecutorShape
  | MachineExecutorShape
  | MacOSExecutorShape
  | WindowsExecutorShape
  | ReusableExecutorShape;

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
 */
export type ExecutorLiteral = 'docker' | 'machine' | 'macos';
