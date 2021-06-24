import Executor from '../../Components/Executor/Executor';
import { DockerExecutorSchema, DockerImageMap } from './DockerExecutor.types';
import { DockerImage } from './DockerImage';

/**
 * A Docker based CircleCI executor {@link https://circleci.com/docs/2.0/configuration-reference/?section=configuration#docker}
 */
export class DockerExecutor extends Executor {
  /**
   * The name of a custom Socker image to use
   */
  image: DockerImage;
  /**
   * Add additional Docker images which will be accessable from the primary container. This is typically used for adding a database as a service container.
   */
  serviceImages: DockerImage[] = [];

  /**
   * Instantiate a Docker executor.
   * @param name - The name of this reusable executor.
   * @param image - The primary docker container image.
   */
  constructor(name: string, image: string) {
    super(name);
    const newImage = new DockerImage(image);
    this.image = newImage;
  }
  /**
   * Generate Docker Executor schema.
   * @returns The generated JSON for the Docker Executor.
   */
  generate(): DockerExecutorSchema {
    const imagesArray: DockerImage[] = [this.image];
    imagesArray.concat(this.serviceImages);
    const dockerImageMap: DockerImageMap[] = [];
    imagesArray.forEach((img) => {
      dockerImageMap.push({
        image: img.image,
      });
    });
    return {
      [this.name]: {
        docker: dockerImageMap,
      },
    };
  }
}
