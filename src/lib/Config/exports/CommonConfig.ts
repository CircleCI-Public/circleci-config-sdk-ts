import { Generable } from '../../Components';
import { Job } from '../../Components/Job';
import { CustomCommand, ReusableExecutor } from '../../Components/Reusable';
import { OrbImport } from '../../Orb/exports/OrbImport';
import { GenerableType } from './Mapping';

/**
 * A CircleCI configuration. Instantiate a new config and add CircleCI config elements.
 */
export abstract class CommonConfig implements Generable {
  /**
   * Reusable executors to be referenced from jobs.
   */
  executors?: ReusableExecutor[];
  /**
   * Jobs are collections of steps. All of the steps in the job are executed in a single unit, either within a fresh container or VM.
   */
  jobs: Job[];
  /**
   * A command definition defines a sequence of steps as a map to be executed in a job, enabling you to reuse a single command definition across multiple jobs.
   */
  commands?: CustomCommand[];
  /**
   * An orb is precooked reusable configuration.
   */
  orbs?: OrbImport[];

  constructor(
    jobs: Job[] = [],
    executors?: ReusableExecutor[],
    commands?: CustomCommand[],
    orbs?: OrbImport[],
  ) {
    this.jobs = jobs;
    this.executors = executors;
    this.commands = commands;
    this.orbs = orbs;
  }

  /**
   * Add a Custom Command to the current Config. Chainable
   * @param command - Injectable command
   */
  addCustomCommand(command: CustomCommand): this {
    if (!this.commands) {
      this.commands = [command];
    } else {
      this.commands.push(command);
    }

    return this;
  }

  /**
   * Add a Workflow to the current Config. Chainable
   * @param workflow - Injectable Workflow
   */
  addReusableExecutor(executor: ReusableExecutor): this {
    if (!this.executors) {
      this.executors = [executor];
    } else {
      this.executors.push(executor);
    }

    return this;
  }

  /**
   * Add a Job to the current Config. Chainable
   * @param job - Injectable Job
   */
  addJob(job: Job): this {
    this.jobs.push(job);

    return this;
  }

  /**
   * Add orb import to this config.
   * @see parseOrbImport()
   * @param orb - OrbImport to use in this config.
   * @returns Config for chainability.
   */
  importOrb(orb: OrbImport): this {
    if (!this.orbs) {
      this.orbs = [orb];
    } else {
      this.orbs.push(orb);
    }

    return this;
  }

  abstract generate(): string;
  abstract get generableType(): GenerableType;
}
