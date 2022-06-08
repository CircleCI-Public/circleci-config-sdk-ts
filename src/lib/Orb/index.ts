import { Generable } from '../Components';
import { Job } from '../Components/Job';
import { CustomCommand, ReusableExecutor } from '../Components/Reusable';
import { CommonConfig } from '../Config/exports/CommonConfig';
import { GenerableType } from '../Config/exports/Mapping';
import { OrbDefinition } from './exports/OrbDefinition';
import { OrbImport } from './exports/OrbImport';
import { OrbRef } from './exports/OrbRef';
import { OrbDisplayMeta } from './types/Orb.types';

export class Orb extends CommonConfig implements Generable, OrbDefinition {
  /**
   * The name of this orb.
   */
  name: string;
  /**
   * The namespace this orb belongs to.
   */
  namespace: string;
  /**
   * The version of this orb.
   */
  version: string;
  /**
   * Description of the orb.
   */
  description?: string;
  /**
   * Dev hub meta data for this orb.
   */
  display?: OrbDisplayMeta;
  /**
   * @param jobs - The jobs that make up this orb
   * @param executors - The executors this orb provides
   * @param commands - The commands this orb provides
   */
  constructor(
    name: string,
    namespace: string,
    version: string,
    jobs: Job[] = [],
    executors?: ReusableExecutor[],
    commands?: CustomCommand[],
  ) {
    super(jobs, executors, commands);

    this.name = name;
    this.namespace = namespace;
    this.version = version;
  }

  generate(): string {
    return 'not yet implemented';
  }

  get generableType(): GenerableType {
    return GenerableType.ORB;
  }
}

export { OrbImport, OrbRef };
