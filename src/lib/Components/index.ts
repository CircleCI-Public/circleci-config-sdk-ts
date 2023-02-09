import { GenerableType } from '../Config/exports/Mapping';

/**
 * @internal
 */
export interface Generable {
  /**
   * Generate the CircleCI YAML equivalent JSON for config compilation
   * Generable's name is the key in the output.
   */
  generate(flatten?: boolean): unknown;

  /**
   * Generate the CircleCI YAML equivalent JSON contents for config compilation
   */
  generateContents?(flatten?: boolean): unknown;

  /**
   * Type of generable object
   */
  readonly generableType: GenerableType;
}
