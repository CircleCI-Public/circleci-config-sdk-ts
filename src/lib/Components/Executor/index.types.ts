import Component from '../index.types';
import { DockerExecutor } from './DockerExecutor';
import { DockerExecutorSchema } from './DockerExecutor.types';
import { MachineExecutor, MachineExecutorSchema } from './MachineExecutor';
/**
 * A generic reusable Executor
 */
export default abstract class Executor extends Component {
  name: string;
  description?: string;
  constructor(name: string, description?: string) {
    super();
    this.name = name;
    this.description = description;
  }
  abstract generate(): ExectorSchema;
}

export type ResourceClass = 'medium' | 'large' | 'xlarge' | '2xlarge';

export type ExecutorType = DockerExecutor | MachineExecutor;
export type ExectorSchema = DockerExecutorSchema | MachineExecutorSchema;
