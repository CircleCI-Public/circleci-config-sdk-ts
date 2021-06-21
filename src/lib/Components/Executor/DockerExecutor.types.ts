import { DockerImageSchema } from './DockerImage.types';

export interface DockerExecutorSchema {
  [name: string]: {
    docker: DockerImageSchema[];
  };
}

export interface DockerImageMap {
  image: string;
}
