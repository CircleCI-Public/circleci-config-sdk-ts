import { StringParameter } from '../../Parameters/types';
import {
  DockerImageShape,
  DockerImage,
  DockerAuth,
  DockerAuthAWS,
} from '../exports/DockerImage';
import { AnyResourceClassBase } from './Executor.types';
/**
 * A JSON representation of the Docker Executor Schema
 * To be converted to YAML
 */
export type DockerExecutorContentsShape = DockerImageShape[];

export type DockerImageMap = {
  image: StringParameter;
};

/**
 * The available Docker Resource Classes.
 * @see {@link https://circleci.com/docs/2.0/configuration-reference/#docker-executor} for specifications of each class.
 */
export type DockerResourceClass = AnyResourceClassBase;

export { DockerImageShape, DockerImage, DockerAuth, DockerAuthAWS };
