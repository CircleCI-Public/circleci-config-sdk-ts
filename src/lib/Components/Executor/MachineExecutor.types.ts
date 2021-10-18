export interface MachineExecutorSchema {
  machine: {
    image: string;
  };
  resource_class: MachineResourceClass;
}

/**
 * The available Machine(Linux) Resource Classes.
 * @see {@link https://circleci.com/docs/2.0/configuration-reference/#machine-executor-linux} for specifications of each class.
 */
export type MachineResourceClass = 'medium' | 'large' | 'xlarge' | '2xlarge';
