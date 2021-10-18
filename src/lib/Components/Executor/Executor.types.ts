import { DockerExecutorSchema } from './DockerExecutor.types';
import { MachineExecutorSchema } from './MachineExecutor.types';
import { MacOSExecutorSchema } from './MacOSExecutor.types';
import { WindowsExecutorSchema } from './WindowsExecutor.types';

export type ExecutorSchema =
  | DockerExecutorSchema
  | MachineExecutorSchema
  | MacOSExecutorSchema
  | WindowsExecutorSchema;
