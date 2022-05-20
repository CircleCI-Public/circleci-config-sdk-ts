import { GenerableType } from '../../../../Config/exports/Mapping';
import { StringParameter } from '../../../Parameters/types';
import { CommandParameters, CommandShape } from '../../types/Command.types';
import { Command } from '../Command';

/**
 * Special step used to upload and store test results for a build. Test results are visible on the CircleCI web application, under each build’s “Test Summary” section. Storing test results is useful for timing analysis of your test suites.
 * @param parameters - StoreTestResultsParameters
 */
export class StoreTestResults implements Command {
  parameters: StoreTestResultsParameters;
  constructor(parameters: StoreTestResultsParameters) {
    this.parameters = parameters;
  }
  /**
   * Generate StoreTestResults Command shape.
   * @returns The generated JSON for the StoreTestResults Commands.
   */
  generate(): StoreTestResultsCommandShape {
    return {
      store_test_results: { ...this.parameters },
    } as StoreTestResultsCommandShape;
  }

  get name(): StringParameter {
    return 'store_test_results';
  }

  get generableType(): GenerableType {
    return GenerableType.STORE_TEST_RESULTS;
  }
}

/**
 * Command parameters for the StoreTestResults command
 */
export interface StoreTestResultsParameters extends CommandParameters {
  /**
   * Path (absolute, or relative to your working_directory) to directory containing subdirectories of JUnit XML or Cucumber JSON test metadata files
   */
  path: StringParameter;
}

/**
 * Generated Shape of the StoreTestResults command.
 */
export interface StoreTestResultsCommandShape extends CommandShape {
  store_test_results: StoreTestResultsParameters;
}
