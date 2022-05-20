import { GenerableType } from '../Config/exports/Mapping';

/**
 * @internal
 */
export interface Generable {
  // TODO: Add generateContents for mapped types
  /**
   * Generate the CircleCI YAML equivalent JSON for config compilation
   */
  generate(): unknown;

  /**
   * Type of generable object
   */
  get generableType(): GenerableType;
}
