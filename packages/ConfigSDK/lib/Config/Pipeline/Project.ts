export type VCSLiteral = 'bitbucket' | 'github' | 'local';

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
  get vcs(): VCSLiteral {
    if (this._isLocal) {
      return 'local';
    } else {
      const regexp1 = /https:\/\/(?:www\.)?(github|bitbucket)\.(?:com|org)/;
      const repo_url = process.env.CIRCLE_REPOSITORY_URL as string;
      const match = repo_url.match(regexp1);
      if (match && match[1]) {
        return match[1] as VCSLiteral;
      }
      throw new Error(
        `Unrecognized VCS provider while obtaining Pipeline.Project.VCS from URL ${repo_url}.`,
      );
    }
  }
}
