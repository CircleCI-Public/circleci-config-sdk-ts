import {
	Executor
} from "../../Components/Executor/index.types"
import {
	DockerImage
} from "./DockerImage"
import {
	DockerImageMap,
	DockerExecutorSchema
} from "./DockerExecutor.types"

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