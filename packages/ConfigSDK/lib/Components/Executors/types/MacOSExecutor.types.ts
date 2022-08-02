import { StringParameter } from '../../Parameters/types';
import { AnyResourceClass } from './Executor.types';
/**
 * A JSON representation of the MacOS Executor Schema
 * To be converted to YAML
 */
export type MacOSExecutorShape = {
  xcode: StringParameter;
};

/**
 * The available MacOS Resource Classes.
 * @see {@link https://circleci.com/docs/2.0/configuration-reference/#macos-executor} for specifications of each class.
 */
export type MacOSResourceClass = Extract<AnyResourceClass, 'medium' | 'large'>;
