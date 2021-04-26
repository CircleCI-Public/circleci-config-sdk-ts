export default abstract class Component {
	/**
	 * Generate the CircleCI YAML equivelant JSON for config compilation
	 */
	abstract generate(): unknown
}
