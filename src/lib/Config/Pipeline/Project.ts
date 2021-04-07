export class Project {
	/**
	 * The URL where the current project is hosted. E.g. https://github.com/circleci/circleci-docs
	 */
	get git_url(): string {
		return "git.local"
	}
	/**
	 * The lower-case name of the VCS provider, E.g. “github”, “bitbucket”
	 */
	get type(): string {
		return "local"
	}
}