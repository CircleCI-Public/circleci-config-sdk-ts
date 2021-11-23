import { StringParameter } from '../../Parameters/types/Parameters.types';
import { AnyResourceClass } from './Executor.types';

/**
 * A JSON representation of the Windows Executor Schema
 * To be converted to YAML
 */
export interface WindowsExecutorShape {
  machine: {
    image: StringParameter;
  };
  resource_class: WindowsResourceClassGenerated;
  shell: StringParameter;
}
/**
 * The available Windows Resource Classes.
 * @see {@link https://circleci.com/docs/2.0/configuration-reference/#windows-executor} for specifications of each class.
 */
export type WindowsResourceClass = Extract<
  AnyResourceClass,
  'medium' | 'large' | 'xlarge' | '2xlarge'
>;

/**
 * Completed resource class after generation, including the windows prefix.
 */
export type WindowsResourceClassGenerated =
  | 'windows.medium'
  | 'windows.large'
  | 'windows.xlarge'
  | 'windows.2xlarge';
