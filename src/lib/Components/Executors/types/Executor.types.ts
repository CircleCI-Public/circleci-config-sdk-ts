import { GenerableType } from '../../../Config/exports/Mapping';
import { CustomParametersList } from '../../Parameters';
import { ExecutorParameterLiteral } from '../../Parameters/types/CustomParameterLiterals.types';
import { Executor } from '../exports/Executor';
import { ReusableExecutor } from '../exports/ReusableExecutor';
import { ExecutableProperties } from './ExecutorParameters.types';

export type UnknownExecutableShape = {
  resource_class: AnyResourceClass;
  [key: string]: unknown;
};

/**
 * The executor output shapes for YAML string
 */
export type ExecutorShape = {
  resource_class: string;
} & Partial<Record<ExecutorLiteral, unknown>> &
  ExecutableProperties;

/**
 * The valid resource classes found for an executor object
 */
export type AnyResourceClass =
  | 'small'
  | 'medium'
  | 'medium+'
  | 'large'
  | 'xlarge'
  | '2xlarge'
  | '2xlarge+';

/**
 * The valid executors found on an executor object
 * Windows is covered by the machine literal
 */
export type ExecutorLiteral = 'docker' | 'machine' | 'macos';

/**
 * The valid executors found on an object referencing an executor
 */
export type ExecutorUsageLiteral = ExecutorLiteral | 'executor';

export type UnknownParameterized = {
  parameters?: { [key: string]: unknown };
};

export type ReusableExecutorDefinition = {
  [key: string]: UnknownExecutableShape & UnknownParameterized;
};

export type ReusableExecutorDependencies = {
  parametersList?: CustomParametersList<ExecutorParameterLiteral>;
  executor: Executor;
};

export type ExecutorSubtypeMap = {
  [key in ExecutorUsageLiteral | 'windows']: {
    generableType: GenerableType;
    parse: ExecutorSubtypeParser;
  };
};

export type ExecutorSubtypeParser = (
  args: unknown,
  resourceClass: AnyResourceClass,
  properties?: ExecutableProperties,
  reusableExecutors?: ReusableExecutor[],
) => Executor | ReusableExecutor;
