import { Parameterized } from '../../Components/Parameters/exports/Parameterized';
import { AnyParameterLiteral } from '../../Components/Parameters/types/CustomParameterLiterals.types';

export type OrbJobComponentLiteral = 'jobs';
export type OrbExecutorComponentLiteral = 'executors';
export type OrbCommandComponentLiteral = 'commands';

export type AnyOrbComponentLiteral =
  | OrbJobComponentLiteral
  | OrbExecutorComponentLiteral
  | OrbCommandComponentLiteral;

export type OrbDisplayMeta = {
  home_url: string;
  source_url: string;
};

export type OrbImportShape = {
  [importName: string]: string;
};

export type OrbImportsShape = Record<string, OrbImportShape>;
export type OrbComponent = Parameterized<AnyParameterLiteral>;
export type OrbImportManifest = Record<
  AnyOrbComponentLiteral,
  Record<string, unknown>
>;
