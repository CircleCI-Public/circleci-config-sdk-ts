import { ErrorObject, SchemaObject } from 'ajv';

export enum GenerableType {
  REUSABLE_COMMAND = 'reusable_command',
  CUSTOM_COMMAND = 'custom_command',
  RESTORE = 'restore',
  SAVE = 'save',
  ATTACH = 'attach',
  PERSIST = 'persist',
  ADD_SSH_KEYS = 'add_ssh_keys',
  CHECKOUT = 'checkout',
  RUN = 'run',
  SETUP_REMOTE_DOCKER = 'setup_remote_docker',
  STORE_ARTIFACTS = 'store_artifacts',
  STORE_TEST_RESULTS = 'store_test_results',

  STEP = 'step',
  JOB = 'job',
  WORKFLOW_JOB = 'workflow_job',

  DOCKER_EXECUTOR = 'docker_executor',
  MACHINE_EXECUTOR = 'machine_executor',
  MACOS_EXECUTOR = 'macos_executor',
  WINDOWS_EXECUTOR = 'windows_executor',
  REUSABLE_EXECUTOR = 'reusable_executor',

  CUSTOM_PARAMETER = 'custom_parameter',
  CUSTOM_ENUM_PARAMETER = 'custom_enum_parameter',
  CUSTOM_PARAMETERS_LIST = 'custom_parameters_list',
}

export enum ParameterSubtype {
  JOB_PARAMS = 'job_params',
  COMMAND_PARAMS = 'command_params',
  EXECUTOR_PARAMS = 'executor_params',
  PIPELINE_PARAMS = 'pipeline_params',

  STRING = 'string',
  BOOLEAN = 'boolean',
  INTEGER = 'integer',
  STEPS = 'steps',
  EXECUTOR = 'executor',
  ENV_VAR_NAME = 'env_var_name',
}

export enum ParametersListSubtype {
  JOB = 'job',
  COMMAND = 'command',
  EXECUTOR = 'executor',
  PIPELINE = 'pipeline',
}

export type GenerableSubtypes = ParameterSubtype | ParametersListSubtype;

export type ValidationResult = boolean | ErrorObject[] | null | undefined;

export type GenerableSubTypesMap = {
  [GenerableType.CUSTOM_PARAMETER]: {
    [key in ParameterSubtype]: SchemaObject;
  };
  [GenerableType.CUSTOM_PARAMETERS_LIST]: {
    [key in ParametersListSubtype]: SchemaObject;
  };
};

export type ValidationMap = GenerableSubTypesMap & {
  [key in GenerableType]: SchemaObject;
};
