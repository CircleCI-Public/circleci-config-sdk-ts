import { Executor } from './Executor';
import { Config } from '../../../Config';
import {
  DockerExecutorShape,
  DockerImageMap,
  DockerResourceClass,
} from '../types/DockerExecutor.types';
import { DockerImage } from './DockerImage';
import { ValidationResult } from '../../../Config/ConfigValidator';
import DockerExecutorSchema from '../schemas/DockerExecutor.schema';
import { ExecutorParameters } from '../types/ExecutorParameters.types';

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
  /**
   * Instantiate a Docker executor.
   * @param name - The name of this reusable executor.
   * @param image - The primary docker container image.
   */
  resource_class: DockerResourceClass;
  constructor(
    image: string,
    resource_class: DockerResourceClass = 'medium',
    parameters?: ExecutorParameters,
  ) {
    super(resource_class, parameters);
    const newImage = new DockerImage(image);
    this.image = newImage;
    this.resource_class = resource_class;
  }
  /**
   * Generate Docker Executor schema.
   * @returns The generated JSON for the Docker Executor.
   */
  generate(): DockerExecutorShape {
    const imagesArray: DockerImage[] = [this.image];
    imagesArray.concat(this.serviceImages);
    const dockerImageMap: DockerImageMap[] = [];
    imagesArray.forEach((img) => {
      dockerImageMap.push({
        image: img.image,
      });
    });
    return {
      docker: dockerImageMap,
      resource_class: this.resource_class,
    };
  }

  static validate(input: unknown): ValidationResult {
    return Config.validator.validateData(DockerExecutorSchema, input);
  }
}
