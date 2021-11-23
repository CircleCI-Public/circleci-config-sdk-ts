import {
  ComponentParameter as ComponentParameters,
  ExecutorParameterTypes,
} from '../../Parameters/types/ComponentParameters.types';
import {
  EnvironmentParameter,
  StringParameter,
} from '../../Parameters/types/Parameters.types';

export interface ExecutorParameters
  extends ComponentParameters<ExecutorParameterTypes> {
  description?: StringParameter;
  shell?: StringParameter;
  working_directory?: StringParameter;
  environment?: EnvironmentParameter;

  [key: string]: ExecutorParameterTypes | undefined;
}
