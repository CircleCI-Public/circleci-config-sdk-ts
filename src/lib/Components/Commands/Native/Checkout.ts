import { Command, CommandParameters, CommandSchema } from '../Command';

/**
 * A special step used to check out source code to the configured path.
 * (defaults to the working_directory).
 * @param parameters - CheckoutParameters
 */
export class Checkout extends Command {
  parameters?: CheckoutParameters = {};
  constructor(parameters?: CheckoutParameters) {
    super('checkout');
    if (parameters) {
      this.parameters = parameters;
    }
  }
  /**
   * Generate Checkout Command schema.
   * @returns The generated JSON for the Checkout Commands.
   */
  generate(): CheckoutCommandSchema {
    return {
      checkout: { ...this.parameters },
    };
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
  path?: string;
}
export interface CheckoutCommandSchema extends CommandSchema {
  checkout: CheckoutParameters;
}
