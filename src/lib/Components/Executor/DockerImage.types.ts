
export interface DockerImageSchema {
    image: string
    name?: string
    entrypoint?: string[]
    command?: string[]
    user?: string
    environment?: Map<string, string>
    auth?: DockerAuth
    aws_auth?: DockerAuthAWS
}
/**
 * Authentication for registries using standard `docker login` credentials
 */
export interface DockerAuth {
    username: string,
    /**
     * Specify an environment variable (e.g. $DOCKER_PASSWORD)
     */
    password: string
}

/**
 * Authentication for AWS Elastic Container Registry (ECR)
 */
export interface DockerAuthAWS {
    aws_access_key_id: string,
    /**
     * Specify an environment variable (e.g. $ECR_AWS_SECRET_ACCESS_KEY)
     */
    aws_secret_access_key: string
}

