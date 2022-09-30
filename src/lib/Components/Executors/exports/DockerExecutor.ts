import { GenerableType } from '../../../Config/exports/Mapping';
import {
  DockerExecutorContentsShape,
  DockerResourceClass,
} from '../types/DockerExecutor.types';
import { ExecutorLiteral } from '../types/Executor.types';
import { DockerImage, DockerImageShape } from './DockerImage';
import { Executor } from './Executor';

/**
 * A Docker based CircleCI executor.
 * @see {@link https://circleci.com/docs/2.0/configuration-reference/?section=configuration#docker}
 */
export class DockerExecutor extends Executor {
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

  constructor(
    image: string,
    resource_class: DockerResourceClass = 'medium',
    properties?: Exclude<DockerImageShape, 'image'>,
    serviceImages?: DockerImage[],
  ) {
    super(resource_class);
    const newImage = new DockerImage(
      image,
      properties?.name,
      properties?.entrypoint,
      properties?.command,
      properties?.user,
      properties?.environment,
      properties?.auth,
      properties?.aws_auth,
    );
    this.image = newImage;
    this.serviceImages = serviceImages || [];
  }
  /**
   * Generate Docker Executor schema.
   * @returns The generated JSON for the Docker Executor.
   */
  generateContents(): DockerExecutorContentsShape {
    const imagesArray: DockerImage[] = [this.image];
    return imagesArray.concat(this.serviceImages);
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
    if (!this.image.environment) {
      this.image.environment = {
        [name]: value,
      };
    } else {
      this.image.environment[name] = value;
    }
    return this;
  }

  /**
   * Add additional images to run along side the primary docker image.
   */
  addServiceImage(image: DockerImage): this {
    this.serviceImages.push(image);
    return this;
  }
}
