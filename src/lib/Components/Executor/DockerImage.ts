import { DockerAuth, DockerAuthAWS, DockerImageSchema } from "./DockerImage.types"

export class DockerImage implements DockerImageSchema {
		image: string
		name?: string
		entrypoint?: string[]
		command?: string[]
		user?: string
		environment?: Map<string, string>
		auth?: DockerAuth
		aws_auth?: DockerAuthAWS
		constructor(image: string, name?: string, entrypoint?: string[], command?: string[], user?: string, environment?: Map<string, string>, auth?: DockerAuth, aws_auth?: DockerAuthAWS ) {
			this.image = image
			this.name = name
			this.entrypoint = entrypoint
			this.command = command
			this.user = user
			this.environment = environment
			this.auth = auth
			this.aws_auth = aws_auth
		}
		generate(): DockerImageSchema {
			return {
				image: this.image,
				name: this.name,
				entrypoint: this.entrypoint,
				command: this.command,
				user: this.user,
				environment: this.environment,
				auth: this.auth,
				aws_auth: this.aws_auth

			}
		}
}