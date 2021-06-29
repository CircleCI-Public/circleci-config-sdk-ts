import { DockerExecutor, MachineExecutor } from '.';
import { DockerExecutorSchema } from './DockerExecutor.types';
import { MachineExecutorSchema } from './MachineExecutor.types';
import { MacOSExecutor } from './MacOSExecutor';
import { MacOSExecutorSchema } from './MacOSExecutor.types';
import { WindowsExecutor } from './WindowsExecutor';
import { WindowsExecutorSchema } from './WindowsExecutor.types';

export type ExecutorType =
  | DockerExecutor
  | MachineExecutor
  | MacOSExecutor
  | WindowsExecutor;
export type ExecutorSchema =
  | DockerExecutorSchema
  | MachineExecutorSchema
  | MacOSExecutorSchema
  | WindowsExecutorSchema;
