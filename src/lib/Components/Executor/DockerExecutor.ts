import Executor from "../../Components/Executor/index.types"
import { DockerImage } from "./DockerImage"
import { DockerImageMap, DockerExecutorSchema } from "./DockerExecutor.types"

/**
 * A Docker based CircleCI executor {@link https://circleci.com/docs/2.0/configuration-reference/?section=configuration#docker}
 */
export class DockerExecutor extends Executor {
	image: DockerImage;
	serviceImages: DockerImage[] = [];

	constructor(name: string, image: string) {
		super(name)
		const newImage = new DockerImage(image)
		this.image = newImage
	}

	generate(): DockerExecutorSchema {
		const imagesArray: DockerImage[] = [this.image]
		imagesArray.concat(this.serviceImages)
		const dockerImageMap: DockerImageMap[] = []
		imagesArray.forEach((img) => {
			dockerImageMap.push({
				image: img.image,
			})
		})
		return {
			[this.name]: {
				docker: dockerImageMap,
			},
		}
	}
}
