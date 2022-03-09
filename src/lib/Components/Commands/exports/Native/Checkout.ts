import { GenerableType } from '../../../../Config/types/Config.types';
import { StringParameter } from '../../../Parameters/types/Parameters.types';
import { CommandParameters, CommandShape } from '../../types/Command.types';
import { Command } from '../Command';

/**
 * A special step used to check out source code to the configured path.
 * (defaults to the working_directory).
 * @param parameters - CheckoutParameters
 */
export class Checkout implements Command {
  parameters?: CheckoutParameters = {};
  constructor(parameters?: CheckoutParameters) {
    if (parameters) {
      this.parameters = parameters;
    }
  }
  /**
   * Generate Checkout Command shape.
   * @returns The generated JSON for the Checkout Commands.
   */
  generate(): CheckoutCommandShape {
    return {
      checkout: { ...this.parameters },
    };
  }

  get name(): StringParameter {
    return 'checkout';
  }

  get generableType(): GenerableType {
    return GenerableType.CHECKOUT;
  }
}

/**
 * Command parameters for the Checkout command
 */
export interface CheckoutParameters extends CommandParameters {
  /**
   * Checkout directory.
   * Will be interpreted relative to the working_directory of the job.
   */
  path?: StringParameter;
}
export interface CheckoutCommandShape extends CommandShape {
  checkout: CheckoutParameters;
}
