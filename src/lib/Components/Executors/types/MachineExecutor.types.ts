import { StringParameter } from '../../Parameters/types';
import { AnyResourceClass } from './Executor.types';
import { ExecutableProperties } from './ExecutorParameters.types';

export type MachineExecutorShape = {
  machine: {
    image: StringParameter;
  };
  resource_class: MachineResourceClass;
} & ExecutableProperties;

/**
 * The available Machine(Linux) Resource Classes.
 * @see {@link https://circleci.com/docs/2.0/configuration-reference/#machine-executor-linux} for specifications of each class.
 */
export type MachineResourceClass = Extract<
  AnyResourceClass,
  'medium' | 'large' | 'xlarge' | '2xlarge'
>;
