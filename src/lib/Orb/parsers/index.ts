import { AnyParameterLiteral } from '../../Components/Parameters/types/CustomParameterLiterals.types';
import { OrbImport } from '../exports/OrbImport';
import { OrbRef } from '../exports/OrbRef';
import { AnyOrbComponentLiteral, OrbImportManifest } from '../types/Orb.types';

export const orbImportPattern = /^(.*)\/(.*)@(([0-5])(\.[0-5])?(\.[0-5])?)$/;

export const UNDEFINED_ORB = new OrbImport('', '', '', '');

/**
 * Parses high level orb import definition
 */
export function parseOrbImport(
  unknownImport: unknown,
  manifest?: OrbImportManifest,
): OrbImport | undefined {
  const [alias, orbImport] = Object.entries(
    unknownImport as Record<string, string>,
  )[0];
  const match = orbImport.match(orbImportPattern);

  if (!match) {
    return;
  }

  const [, namespace, orb, version] = match;

  return new OrbImport(alias, namespace, orb, version, manifest);
}

export function parseOrbImports(
  unknownOrbs: Record<string, unknown>,
  manifests?: Record<string, OrbImportManifest>,
): OrbImport[] | undefined {
  let orbImports: OrbImport[] | undefined = undefined;

  Object.entries(unknownOrbs).forEach(([alias, orbImport]) => {
    const parsedImport = parseOrbImport(
      { [alias]: orbImport },
      manifests ? manifests[alias] : undefined,
    );

    if (parsedImport) {
      if (orbImports) {
        orbImports.push(parsedImport);
      } else {
        orbImports = [parsedImport];
      }
    }
  });

  return orbImports;
}

export function parseOrbRef<Literal extends AnyParameterLiteral>(
  orbRefInput: Record<string, unknown> | string,
  refType: AnyOrbComponentLiteral,
  orbs?: OrbImport[],
): OrbRef<Literal> | undefined {
  const isFlat = typeof orbRefInput === 'string';
  const orbRef = isFlat ? orbRefInput : Object.keys(orbRefInput)[0];

  if (!orbRef.includes('/')) {
    return undefined;
  }

  const [orbAlias, name] = orbRef.split('/');
  const orbImport = orbs?.find((orb) => orb.alias === orbAlias);

  if (orbImport && orbImport[refType]) {
    return orbImport[refType][name] as OrbRef<Literal>;
  }
}
