import { EnvironmentParameter, StringParameter } from '../../Parameters/types';
import {
  ComponentParameter as ComponentParameters,
  ExecutorParameterTypes,
} from '../../Parameters/types/ComponentParameters.types';

export interface Executable {
  /**
   * Shell to use for execution command in all steps.
   */
  shell?: StringParameter;

  /**
   * In which directory to run the steps. Will be interpreted as an absolute path.
   */
  working_directory?: StringParameter;

  /**
   * A map of environment variable names and values.
   */
  environment?: EnvironmentParameter;
}

export type ExecutableProperties = Executable;

export type ExecutableParameters = ComponentParameters<ExecutorParameterTypes> &
  ExecutableProperties & {
    [key: string]: ExecutorParameterTypes | undefined;
  };
