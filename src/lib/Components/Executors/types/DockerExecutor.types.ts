import { StringParameter } from '../../Parameters/types';
import { DockerImageShape } from '../exports/DockerImage';
import { AnyResourceClass } from './Executor.types';
import { ExecutableProperties } from './ExecutorParameters.types';
/**
 * A JSON representation of the Docker Executor Schema
 * To be converted to YAML
 */
export type DockerExecutorShape = {
  docker: DockerImageShape[];
  resource_class: DockerResourceClass;
} & ExecutableProperties;

export type DockerImageMap = {
  image: StringParameter;
};

/**
 * The available Docker Resource Classes.
 * @see {@link https://circleci.com/docs/2.0/configuration-reference/#docker-executor} for specifications of each class.
 */
export type DockerResourceClass = AnyResourceClass;
