export interface MacOSExecutorSchema {
  macos: {
    xcode: string;
  };
  resource_class: MacOSResourceClass;
}

/**
 * The available MacOS Resource Classes.
 * @see {@link https://circleci.com/docs/2.0/configuration-reference/#macos-executor} for specifications of each class.
 */
export type MacOSResourceClass = 'medium' | 'large';
