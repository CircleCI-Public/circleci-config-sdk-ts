import { Command, CommandParameters, CommandSchema } from '../Command';

/**
 * Special step used to upload and store test results for a build. Test results are visible on the CircleCI web application, under each build’s “Test Summary” section. Storing test results is useful for timing analysis of your test suites.
 * @param parameters - StoreTestResultsParameters
 */
export class StoreTestResults extends Command {
  parameters: StoreTestResultsParameters;
  constructor(parameters: StoreTestResultsParameters) {
    super('store_test_results');
    this.parameters = parameters;
  }
  /**
   * Generate StoreTestResults Command schema.
   * @returns The generated JSON for the StoreTestResults Command.
   */
  generate(): StoreTestResultsCommandSchema {
    return {
      store_test_results: { ...this.parameters },
    } as StoreTestResultsCommandSchema;
  }
}
export default StoreTestResults;
export interface StoreTestResultsParameters extends CommandParameters {
  /**
   * Path (absolute, or relative to your working_directory) to directory containing subdirectories of JUnit XML or Cucumber JSON test metadata files
   */
  path: string;
}

export interface StoreTestResultsCommandSchema extends CommandSchema {
  store_test_results: StoreTestResultsParameters;
}
