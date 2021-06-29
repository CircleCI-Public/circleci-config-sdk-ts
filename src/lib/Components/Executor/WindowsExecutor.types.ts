export interface WindowsExecutorSchema {
  [name: string]: {
    machine: {
      image: string;
    };
    resource_class: string; // windows.WindowsResourceClass
    shell: 'powershell.exe -ExecutionPolicy Bypass';
  };
}

/**
 * The available Windows Resource Classes.
 * @see {@link https://circleci.com/docs/2.0/configuration-reference/#windows-executor} for specifications of each class.
 */
export type WindowsResourceClass = 'medium' | 'large' | 'xlarge' | '2xlarge';
