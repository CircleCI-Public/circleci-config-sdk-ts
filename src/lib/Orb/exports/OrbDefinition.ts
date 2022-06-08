import { OrbDisplayMeta } from '../types/Orb.types';

export interface OrbDefinition {
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

  /*
   * Description of the orb.
   */
  description?: string;

  /**
   * The display metadata for this orb.
   */
  display?: OrbDisplayMeta;
}
