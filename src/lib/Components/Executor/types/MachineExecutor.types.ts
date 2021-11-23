import { StringParameter } from '../../Parameters/types/Parameters.types';
import { AnyResourceClass } from './Executor.types';

export interface MachineExecutorShape {
  machine: {
    image: StringParameter;
  };
  resource_class: MachineResourceClass;
}

/**
 * The available Machine(Linux) Resource Classes.
 * @see {@link https://circleci.com/docs/2.0/configuration-reference/#machine-executor-linux} for specifications of each class.
 */
export type MachineResourceClass = Extract<
  AnyResourceClass,
  'medium' | 'large' | 'xlarge' | '2xlarge'
>;
