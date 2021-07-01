import Run from './Native/Run';
import Checkout from './Native/Checkout';
import * as Cache from './Native/Cache';
import * as Workspace from './Native/Workspace';
import StoreTestResults from './Native/StoreTestResults';
import StoreArtifacts from './Native/StoreArtifacts';
import SetupRemoteDocker from './Native/SetupRemoteDocker';

/**
 * All available commands that can be used within jobs.
 * Use the Run command to execute scripts.
 */
const Command = {
  Run,
  Checkout,
  Cache,
  Workspace,
  StoreArtifacts,
  StoreTestResults,
  SetupRemoteDocker,
};
export default Command;
