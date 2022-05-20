/**
 * All potential parameter type literals that can be supplied to custom reusable components.
 * @see {@link  https://circleci.com/docs/2.0/reusing-config/#parameter-syntax}
 */
export type AnyParameterLiteral =
  | 'string'
  | 'boolean'
  | 'integer'
  | EnumParameterLiteral
  | 'executor'
  | 'steps'
  | 'env_var_name';

/*
 * Enum parameter type literal.
 */
export type EnumParameterLiteral = 'enum';

/**
 * Custom Parameter types available to Jobs
 * @see {@link CustomParametersList}
 * @see {@link ParameterizedJob}
 */
export type JobParameterLiteral = AnyParameterLiteral;

/**
 * Custom Parameter types available to Commands
 */
export type CommandParameterLiteral = Extract<
  AnyParameterLiteral,
  | 'string'
  | 'boolean'
  | 'integer'
  | EnumParameterLiteral
  | 'steps'
  | 'env_var_name'
>;

/**
 * Custom Parameter types available to Executors
 */
export type ExecutorParameterLiteral = Extract<
  AnyParameterLiteral,
  'string' | 'boolean' | 'integer' | EnumParameterLiteral
>;

/**
 * Custom Parameter types available to the Pipeline at the Config level.
 */
export type PipelineParameterLiteral = Extract<
  AnyParameterLiteral,
  'string' | 'boolean' | 'integer' | EnumParameterLiteral
>;

/*
 * Component types which can be parameterized.
 */
export type ParameterizedComponentLiteral =
  | 'job'
  | 'command'
  | 'executor'
  | 'pipeline';
