export interface WindowsExecutorSchema {
  machine: {
    image: string;
  };
  resource_class: WindowsResourceClassGenerated;
  shell: 'powershell.exe -ExecutionPolicy Bypass';
}

/**
 * The available Windows Resource Classes.
 * @see {@link https://circleci.com/docs/2.0/configuration-reference/#windows-executor} for specifications of each class.
 */
export type WindowsResourceClass = 'medium' | 'large' | 'xlarge' | '2xlarge';

/**
 * Completed resource class after generation, including the windows prefix.
 */
export type WindowsResourceClassGenerated =
  | 'windows.medium'
  | 'windows.large'
  | 'windows.xlarge'
  | 'windows.2xlarge';
