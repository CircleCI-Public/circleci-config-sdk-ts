export interface MacOSExecutorSchema {
  [name: string]: {
    macos: {
      xcode: string;
    };
    resource_class: MacOSResourceClass;
  };
}

/**
 * The available MacOS(Linux) Resource Classes.
 * @see {@link https://circleci.com/docs/2.0/configuration-reference/#MacOS-executor-linux} for specifications of each class.
 */
export type MacOSResourceClass = 'medium' | 'large';
