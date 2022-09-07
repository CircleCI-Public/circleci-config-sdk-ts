import { GenerableType } from '../../../Config/exports/Mapping';
import { EnvironmentParameter, StringParameter } from '../../Parameters/types';
import {
  DockerExecutorContentsShape,
  DockerResourceClass,
} from '../types/DockerExecutor.types';
import { ExecutorLiteral } from '../types/Executor.types';
import {
  Executable,
  ExecutableParameters,
} from '../types/ExecutorParameters.types';
import { DockerImage } from './DockerImage';
import { Executor } from './Executor';

/**
 * A Docker based CircleCI executor.
 * @see {@link https://circleci.com/docs/2.0/configuration-reference/?section=configuration#docker}
 */
export class DockerExecutor extends Executor implements Executable {
  /**
   * The name of a custom Docker image to use.
   * @example "cimg/base:stable"
   */
  image: DockerImage;
  /**
   * Add additional Docker images which will be accessible from the primary container.
   * This is typically used for adding a database as a service container.
   */
  serviceImages: DockerImage[] = [];

  shell?: StringParameter;
  working_directory?: StringParameter;
  environment?: EnvironmentParameter;

  constructor(
    image: string,
    resource_class: DockerResourceClass = 'medium',
    serviceImages: DockerImage[] = [],
    properties?: ExecutableParameters,
  ) {
    super(resource_class);
    const newImage = new DockerImage(image);
    this.image = newImage;
    this.serviceImages = serviceImages;
    this.shell = properties?.shell;
    this.environment = properties?.environment;
    this.working_directory = properties?.working_directory;
  }
  /**
   * Generate Docker Executor schema.
   * @returns The generated JSON for the Docker Executor.
   */
  generateContents(): DockerExecutorContentsShape {
    const imagesArray: DockerImage[] = [this.image];
    imagesArray.concat(this.serviceImages);

    return imagesArray;
  }

  get generableType(): GenerableType {
    return GenerableType.DOCKER_EXECUTOR;
  }

  get executorLiteral(): ExecutorLiteral {
    return 'docker';
  }

  /**
   * Add an environment variable to the Executor.
   * This will be set in plain-text via the exported config file.
   * Consider using project-level environment variables or a context for sensitive information.
   * @see {@link https://circleci.com/docs/env-vars}
   * @example
   * ```
   * myExecutor.addEnvVar('MY_VAR', 'my value');
   * ```
   */
  addEnvVar(name: string, value: string): this {
    if (!this.environment) {
      this.environment = {
        [name]: value,
      };
    } else {
      this.environment[name] = value;
    }
    return this;
  }
}
