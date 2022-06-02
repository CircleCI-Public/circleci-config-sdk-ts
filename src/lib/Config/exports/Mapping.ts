export enum GenerableType {
  CONFIG = 'config',

  // Commands
  REUSABLE_COMMAND = 'reusable_command',
  CUSTOM_COMMAND = 'custom_command',
  RESTORE = 'restore_cache',
  SAVE = 'save_cache',
  ATTACH = 'attach_workspace',
  PERSIST = 'persist_to_workspace',
  ADD_SSH_KEYS = 'add_ssh_keys',
  CHECKOUT = 'checkout',
  RUN = 'run',
  SETUP_REMOTE_DOCKER = 'setup_remote_docker',
  STORE_ARTIFACTS = 'store_artifacts',
  STORE_TEST_RESULTS = 'store_test_results',

  // Pipeline components
  STEP = 'step',
  STEP_LIST = 'steps',
  JOB = 'job',
  WORKFLOW_JOB = 'workflow_job',
  WORKFLOW = 'workflow',

  // Executors
  ANY_EXECUTOR = 'executor',
  DOCKER_EXECUTOR = 'docker_executor',
  MACHINE_EXECUTOR = 'machine_executor',
  MACOS_EXECUTOR = 'macos_executor',
  WINDOWS_EXECUTOR = 'windows_executor',
  REUSABLE_EXECUTOR = 'reusable_executor',
  REUSABLE_EXECUTOR_LIST = 'reusable_executors_list',

  // Parameters
  CUSTOM_PARAMETER = 'custom_parameter',
  CUSTOM_ENUM_PARAMETER = 'custom_enum_parameter',
  CUSTOM_PARAMETERS_LIST = 'custom_parameters_list',
  PARAMETER_REFERENCE = 'parameter_reference',

  // Logic
  WHEN = 'when',
  AND = 'and',
  OR = 'or',
  NOT = 'not',
  EQUAL = 'equal',
  TRUTHY = 'value',
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
