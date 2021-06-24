import { DockerImageSchema } from './DockerImage';

export interface DockerExecutorSchema {
  [name: string]: {
    docker: DockerImageSchema[];
  };
}
export interface DockerImageMap {
  image: string;
}
