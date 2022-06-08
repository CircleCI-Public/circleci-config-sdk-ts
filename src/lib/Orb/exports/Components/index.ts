import { ParameterizedJob } from '../../../Components/Job';
import { AnyExecutor } from '../../../Components/Job/types/Job.types';
import { CustomParametersList } from '../../../Components/Parameters';
import { Parameterized } from '../../../Components/Parameters/exports/Parameterized';
import {
  CommandParameterLiteral,
  ExecutorParameterLiteral,
  JobParameterLiteral,
} from '../../../Components/Parameters/types/CustomParameterLiterals.types';
import { CustomCommand, ReusableExecutor } from '../../../Components/Reusable';
import { OrbImportDirective } from '../OrbImport';
import { OrbRef } from '../OrbRef';

export type NamedOrbComponent = Parameterized<
  JobParameterLiteral | ExecutorParameterLiteral | CommandParameterLiteral
> & {
  name: string;
};

export type OrbComponentUsage<
  OrbComponent extends NamedOrbComponent,
  KeptProperties extends Partial<OrbComponent>,
> = {
  new (
    orb: OrbImportDirective,
    ref: Extract<OrbComponent, KeptProperties>,
    parameters?: Record<string, unknown>,
  ): OrbRef<OrbComponent> & {
    component: Extract<OrbComponent, KeptProperties>;
  };
} & typeof OrbRef;

export const JobOrbUsage = OrbRef as OrbComponentUsage<
  ParameterizedJob,
  {
    name: string;
    executor: AnyExecutor;
    parameters: CustomParametersList<JobParameterLiteral>;
  }
>;
export type JobOrbUsage = InstanceType<typeof JobOrbUsage>;

export const CommandOrbUsage = OrbRef as OrbComponentUsage<
  CustomCommand,
  {
    name: string;
    parameters: CustomParametersList<CommandParameterLiteral>;
  }
>;
export type CommandOrbUsage = InstanceType<typeof CommandOrbUsage>;

export const ExecutorOrbUsage = OrbRef as OrbComponentUsage<
  ReusableExecutor,
  {
    name: string;
    parameters: CustomParametersList<ExecutorParameterLiteral>;
  }
>;

export type ExecutorOrbUsage = InstanceType<typeof ExecutorOrbUsage>;
