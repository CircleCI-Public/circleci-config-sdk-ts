import { EnvironmentParameter, StringParameter } from '../../Parameters/types';
import {
  ComponentParameter as ComponentParameters,
  ExecutorParameterTypes,
} from '../../Parameters/types/ComponentParameters.types';

export type ExecutableProperties = {
  description?: StringParameter;
  shell?: StringParameter;
  working_directory?: StringParameter;
  environment?: EnvironmentParameter;
};

export type ExecutableParameters = ComponentParameters<ExecutorParameterTypes> &
  ExecutableProperties & {
    [key: string]: ExecutorParameterTypes | undefined;
  };
