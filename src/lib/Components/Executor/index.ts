import { DockerExecutor } from './DockerExecutor';
import { MachineExecutor } from './MachineExecutor';
import { MacOSExecutor } from './MacOSExecutor';
import { WindowsExecutor } from './WindowsExecutor';
/**
 * Executors define the environment in which the steps of a job will be run.
 * @see {@link https://circleci.com/docs/2.0/configuration-reference/#executors-requires-version-21}
 */
const Executor = {
  /**
   * A Docker based CircleCI executor.
   * @see {@link https://circleci.com/docs/2.0/configuration-reference/?section=configuration#docker}
   */
  DockerExecutor,
  /**
   * The Linux Virtual Machine Executor.
   * @see {@link https://circleci.com/docs/2.0/executor-types/#using-machine}
   */
  MachineExecutor,
  /**
   * A MacOS Virtual Machine with configurable Xcode version.
   * @see {@link https://circleci.com/docs/2.0/executor-types/#using-macos}
   */
  MacOSExecutor,
  /**
   * A Windows Virtual Machine (CircleCI Cloud)
   * @see {@link https://circleci.com/docs/2.0/executor-types/#using-the-windows-executor}
   */
  WindowsExecutor,
};
export default Executor;
