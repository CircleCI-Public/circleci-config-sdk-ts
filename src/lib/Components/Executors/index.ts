/**
 * Instantiate a CircleCI Executor, the build environment for a job. Select a type of executor and supply the required parameters.
 */
import { DockerExecutor } from './exports/DockerExecutor';
import { Executor } from './exports/Executor';
import { MachineExecutor } from './exports/MachineExecutor';
import { MacOSExecutor } from './exports/MacOSExecutor';
import { ReusableExecutor } from './exports/ReusableExecutor';
import { WindowsExecutor } from './exports/WindowsExecutor';

export {
  DockerExecutor,
  MachineExecutor,
  MacOSExecutor,
  WindowsExecutor,
  ReusableExecutor,
  Executor,
};
