/**
 * @internal
 */
export abstract class Component {
  /**
   * Generate the CircleCI YAML equivalent JSON for config compilation
   */
  abstract generate(): unknown;
}
