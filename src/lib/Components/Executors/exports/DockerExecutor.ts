import { GenerableType } from '../../../Config/exports/Mapping';
import {
  DockerExecutorContentsShape,
  DockerResourceClass,
} from '../types/DockerExecutor.types';
import { ExecutorLiteral } from '../types/Executor.types';
import { ExecutableParameters } from '../types/ExecutorParameters.types';
import { DockerImage } from './DockerImage';
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
    serviceImages: DockerImage[] = [],
    parameters?: ExecutableParameters,
  ) {
    super(resource_class, parameters);
    const newImage = new DockerImage(image);
    this.image = newImage;
    this.serviceImages = serviceImages;
  }
  /**
   * Generate Docker Executor schema.
   * @returns The generated JSON for the Docker Executor.
   */
  generateContents(): DockerExecutorContentsShape {
    const imagesArray: DockerImage[] = [this.image];
    imagesArray.concat(this.serviceImages);

    return imagesArray.map((img) => ({
      image: img.image,
    }));
  }

  get generableType(): GenerableType {
    return GenerableType.DOCKER_EXECUTOR;
  }

  get executorLiteral(): ExecutorLiteral {
    return 'docker';
  }
}
