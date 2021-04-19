import { Command, CommandParameters } from "../index.types"

/**
 * A special step used to check out source code to the configured path (defaults to the working_directory).
 * @param parameters - {@link CheckoutParameters}
 */
export class Checkout extends Command {
	parameters?: CheckoutParameters
	constructor(parameters?: CheckoutParameters) {
		super("checkout")
		if (parameters) {
			this.parameters = parameters
		}
	}
	generate(): CheckoutCommandSchema {
		if (this.parameters) {
			return {checkout: {...this.parameters}} as CheckoutCommandSchemaObject
		}
		else {
			return "checkout"
		}
	}
}
export interface CheckoutParameters extends CommandParameters {
	/**
	 * Checkout directory. Will be interpreted relative to the working_directory of the job).
	 */
	path?: string

}

export interface CheckoutCommandSchemaObject {
	checkout: CheckoutParameters
}
export type CheckoutCommandSchemaString = "checkout"

export type CheckoutCommandSchema = CheckoutCommandSchemaObject | CheckoutCommandSchemaString