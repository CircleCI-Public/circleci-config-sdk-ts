import { DockerExecutorShape } from './DockerExecutor.types';
import { MachineExecutorShape } from './MachineExecutor.types';
import { MacOSExecutorShape } from './MacOSExecutor.types';
import { ReusableExecutorShape } from './ReusableExecutor.types';
import { WindowsExecutorShape } from './WindowsExecutor.types';

export type ExecutorShape =
  | DockerExecutorShape
  | MachineExecutorShape
  | MacOSExecutorShape
  | WindowsExecutorShape
  | ReusableExecutorShape;

export type AnyResourceClass =
  | 'small'
  | 'medium'
  | 'medium+'
  | 'large'
  | 'xlarge'
  | '2xlarge'
  | '2xlarge+';
