import { CustomParametersList } from '../../Components/Parameters';
import { Parameterized } from '../../Components/Parameters/exports/Parameterized';
import {
  AnyParameterLiteral,
  CommandParameterLiteral,
  ExecutorParameterLiteral,
  JobParameterLiteral,
} from '../../Components/Parameters/types/CustomParameterLiterals.types';

export type OrbDisplayMeta = {
  home_url: string;
  source_url: string;
};

export type OrbImportShape = {
  [importName: string]: string;
};

export type OrbImportsShape = Record<string, OrbImportShape>;
export type OrbComponent = Parameterized<AnyParameterLiteral>;
export type OrbImportManifest = {
  jobs: Record<string, CustomParametersList<JobParameterLiteral>>;
  executors: Record<string, CustomParametersList<ExecutorParameterLiteral>>;
  commands: Record<string, CustomParametersList<CommandParameterLiteral>>;
};
