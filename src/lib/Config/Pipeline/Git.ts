export class Git {
  private _isLocal = true;
  constructor(isLocal: boolean) {
    this._isLocal = isLocal;
  }
  /**
   * The name of the git tag that was pushed to trigger the pipeline. If the pipeline was not triggered by a tag, then this is the empty string.
   */
  get tag(): string {
    return 'local';
  }
  /**
   * The name of the git branch that was pushed to trigger the pipeline.
   */
  get branch(): string {
    return 'local';
  }
  /**
   * The long (40-character) git SHA that is being built.
   */
  get revision(): string {
    return '0000000000000000000000000000000000000000';
  }
  /**
   * The long (40-character) git SHA of the build prior to the one being built.
   */
  get base_revision(): string {
    return '0000000000000000000000000000000000000000';
  }
}
