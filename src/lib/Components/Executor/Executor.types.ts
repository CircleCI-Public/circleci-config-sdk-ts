import { DockerExecutor, MachineExecutor } from '.';
import { DockerExecutorSchema } from './DockerExecutor.types';
import { MachineExecutorSchema } from './MachineExecutor.types';

export type ExecutorType = DockerExecutor | MachineExecutor;
export type ExecutorSchema = DockerExecutorSchema | MachineExecutorSchema;