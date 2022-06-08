import { Generable } from '../../Components';
import { GenerableType } from '../../Config/exports/Mapping';
import { OrbDisplayMeta } from '../types/Orb.types';
import { CommandOrbUsage, ExecutorOrbUsage, JobOrbUsage } from './Components';
import { OrbDefinition as OrbDefinition } from './OrbDefinition';

export interface OrbImportDirective extends OrbDefinition {
  alias: string;
  namespace: string;
  name: string;
  version: string;
}

export class OrbImport implements Generable, OrbImportDirective {
  alias: string;
  namespace: string;
  name: string;
  version: string;

  jobs?: JobOrbUsage;
  commands?: CommandOrbUsage;
  executors?: ExecutorOrbUsage;

  description?: string;
  display?: OrbDisplayMeta;

  constructor(
    alias: string,
    namespace: string,
    orb: string,
    version: string,
    jobs?: JobOrbUsage,
    commands?: CommandOrbUsage,
    executors?: ExecutorOrbUsage,
    description?: string,
    display?: OrbDisplayMeta,
  ) {
    this.alias = alias;
    this.namespace = namespace;
    this.name = orb;
    this.version = version;
    this.jobs = jobs;
    this.commands = commands;
    this.executors = executors;
    this.description = description;
    this.display = display;
  }

  generate(): unknown {
    return {
      [this.alias]: `${this.namespace}/${this.name}@${this.version}`,
    };
  }

  get generableType(): GenerableType {
    return GenerableType.ORB_IMPORT;
  }
}
