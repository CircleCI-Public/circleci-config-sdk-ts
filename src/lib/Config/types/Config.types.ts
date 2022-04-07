import { ErrorObject, SchemaObject } from 'ajv';

export enum GenerableType {
  CONFIG = 'config',
  REUSABLE_COMMAND = 'reusable_command',
  CUSTOM_COMMAND = 'command',
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
  STEP_LIST = 'steps',
  JOB = 'job',
  WORKFLOW_JOB = 'workflow_job',
  WORKFLOW = 'workflow',

  ANY_EXECUTOR = 'executor',
  DOCKER_EXECUTOR = 'docker_executor',
  MACHINE_EXECUTOR = 'machine_executor',
  MACOS_EXECUTOR = 'macos_executor',
  WINDOWS_EXECUTOR = 'windows_executor',
  REUSABLE_EXECUTOR = 'reusable_executor',
  REUSABLE_EXECUTOR_LIST = 'reusable_executors_list',

  CUSTOM_PARAMETER = 'custom_parameter',
  CUSTOM_ENUM_PARAMETER = 'custom_enum_parameter',
  CUSTOM_PARAMETERS_LIST = 'custom_parameters_list',
}

export enum ParameterSubtype {
  STRING = 'string',
  BOOLEAN = 'boolean',
  INTEGER = 'integer',
  STEPS = 'steps',
  EXECUTOR = 'executor',
  ENV_VAR_NAME = 'env_var_name',
}

export enum ParameterizedComponent {
  JOB = '/parameters/components/job',
  COMMAND = '/parameters/components/command',
  EXECUTOR = '/parameters/components/executor',
  PIPELINE = '/parameters/components/pipeline',
}

export type GenerableSubtypes = ParameterSubtype | ParameterizedComponent;

export type ValidationResult = boolean | ErrorObject[] | null | undefined;

export type GenerableSubTypesMap = {
  [GenerableType.CUSTOM_PARAMETER]: {
    [key in GenerableSubtypes]: SchemaObject;
  };
  [GenerableType.CUSTOM_PARAMETERS_LIST]: {
    [key in ParameterizedComponent]: SchemaObject;
  };
};

export type ValidationMap = GenerableSubTypesMap & {
  [key in GenerableType]: SchemaObject;
};
