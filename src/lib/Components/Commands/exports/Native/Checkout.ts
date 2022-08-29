import { GenerableType } from '../../../../Config/exports/Mapping';
import { StringParameter } from '../../../Parameters/types';
import { BodylessCommand, CommandParameters, CommandShape } from '../../types/Command.types';
import { Command } from '../Command';

/**
 * A special step used to check out source code to the configured path.
 * (defaults to the working_directory).
 * @see {@link https://circleci.com/docs/configuration-reference#checkout}
 */
export class Checkout implements Command {
  parameters?: CheckoutParameters;
  constructor(parameters?: CheckoutParameters) {
    this.parameters = parameters;
  }
  /**
   * Generate Checkout Command shape.
   * @returns The generated JSON for the Checkout Command.
   */
  generate(): CheckoutCommandShape | BodylessCommand {
    if (this.parameters === undefined) {
      return this.name;
    }

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
interface CheckoutCommandShape extends CommandShape {
  checkout: CheckoutParameters;
}
