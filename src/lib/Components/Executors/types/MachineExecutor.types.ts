import { StringParameter } from '../../Parameters/types';
import { AnyResourceClass } from './Executor.types';

export type MachineExecutorShape = {
  image: StringParameter;
};

/**
 * The available Machine(Linux) Resource Classes.
 * @see {@link https://circleci.com/docs/2.0/configuration-reference/#machine-executor-linux} for specifications of each class.
 */
export type MachineResourceClass = Extract<
  AnyResourceClass,
  'medium' | 'large' | 'xlarge' | '2xlarge'
>;
