/**
 * Pipeline Project level information
 */
export class Project {
  private _isLocal: boolean;
  constructor(isLocal: boolean) {
    this._isLocal = isLocal;
  }
  /**
   * The URL where the current project is hosted. E.g. https://github.com/circleci/circleci-docs
   */
  get git_url(): string {
    if (this._isLocal == true) {
      return 'git.local';
    } else {
      return process.env.CIRCLE_REPOSITORY_URL as string;
    }
  }
  /**
   * The lower-case name of the VCS provider, E.g. “github”, “bitbucket”
   */
  get vcs(): 'bitbucket' | 'github' | 'local' {
    if (this._isLocal) {
      return 'local';
    } else {
      const regexp1 = /https:\/\/(?:www\.)?(github|bitbucket)\.(?:com|org)/;
      const match = (process.env.CIRCLE_REPOSITORY_URL as string).match(
        regexp1,
      );
      let host: string;
      if (match) {
        if (match[1]) {
          host = match[1];
        } else {
          console.log(`DEBUG: match: ${match}`);
          host = 'ERROR NO MATCH';
        }
      } else {
        console.log(`DEBUG: match: ${match}`);
        console.log(`DEBUG: Input: ${process.env.CIRCLE_REPOSITORY_URL}`);
        host = 'ERROR NO MATCH';
      }
      switch (host) {
        case 'github':
          return host;
          break;
        case 'bitbucket':
          return host;
          break;
        default:
          throw new Error(
            'Unrecognized VCS provider while obtaining Pipeline.Project.VCS via CIRCLE_REPOSITORY_URL.',
          );
      }
    }
  }
}
