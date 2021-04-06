import { DockerImageSchema } from "./DockerImage.types"

export interface DockerExecutorSchema {
	[key: string]: {
		docker: DockerImageSchema[]
	}
}

export interface DockerImageMap {
	image: string
}