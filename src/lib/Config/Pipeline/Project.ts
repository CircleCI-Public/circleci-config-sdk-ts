export class Project {
  private _isLocal = true;
  constructor(isLocal: boolean) {
    this._isLocal = isLocal;
  }
  /**
   * The URL where the current project is hosted. E.g. https://github.com/circleci/circleci-docs
   */
  get git_url(): string {
    if (this._isLocal) {
      return 'git.local';
    } else {
      return process.env.CIRCLE_REPOSITORY_URL as string;
    }
  }
  /**
   * The lower-case name of the VCS provider, E.g. “github”, “bitbucket”
   */
  get type(): 'bitbucket' | 'github' | 'local' {
    if (this._isLocal) {
      return 'local';
    } else {
      const host = new URL(process.env.CIRCLE_REPOSITORY_URL as string).host;
      switch (host) {
        case 'github':
          return host;
          break;
        case 'bitbucket':
          return host;
          break;
        default:
          throw new Error(
            'Unrecognized VCS provider while obtaining Pipeline.Project.Type via CIRCLE_REPOSITORY_URL.',
          );
      }
    }
  }
}
