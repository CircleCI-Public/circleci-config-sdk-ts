import { DockerExecutor, MachineExecutor } from '.';
import { DockerExecutorSchema } from './DockerExecutor.types';
import { MachineExecutorSchema } from './MachineExecutor.types';
import { MacOSExecutor } from './MacOSExecutor';
import { MacOSExecutorSchema } from './MacOSExecutor.types';

export type ExecutorType = DockerExecutor | MachineExecutor | MacOSExecutor;
export type ExecutorSchema =
  | DockerExecutorSchema
  | MachineExecutorSchema
  | MacOSExecutorSchema;
