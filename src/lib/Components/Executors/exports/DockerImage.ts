import { Generable } from '../..';
import { EnvironmentParameter } from '../../Parameters/types';

export class DockerImage implements DockerImageShape {
  image: string;
  name?: string;
  entrypoint?: string[];
  command?: string[];
  user?: string;
  auth?: DockerAuth;
  environment?: EnvironmentParameter;
  aws_auth?: DockerAuthAWS;

  constructor(
    image: string,
    name?: string,
    entrypoint?: string[],
    command?: string[],
    user?: string,
    environment?: EnvironmentParameter,
    auth?: DockerAuth,
    aws_auth?: DockerAuthAWS,
  ) {
    this.image = image;
    this.name = name;
    this.entrypoint = entrypoint;
    this.command = command;
    this.user = user;
    this.environment = environment;
    this.auth = auth;
    this.aws_auth = aws_auth;
  }
}

/**
 * Type interface for a single Docker image.
 */
export type DockerImageShape = {
  name?: string;
  image: string;
  entrypoint?: string[];
  command?: string[];
  user?: string;
  auth?: DockerAuth;
  environment?: EnvironmentParameter;
  aws_auth?: DockerAuthAWS;
};

/**
 * Authentication for registries using standard `docker login` credentials
 */
export type DockerAuth = {
  username: string;
  /**
   * Specify an environment variable (e.g. $DOCKER_PASSWORD)
   */
  password: string;
};

/**
 * Authentication for AWS Elastic Container Registry (ECR)
 */
export type DockerAuthAWS = {
  aws_access_key_id: string;
  /**
   * Specify an environment variable (e.g. $ECR_AWS_SECRET_ACCESS_KEY)
   */
  aws_secret_access_key: string;
};
