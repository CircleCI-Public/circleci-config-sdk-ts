import { Schema, Validator } from 'jsonschema';

export class ConfigValidator extends Validator {
  constructor(...schemas: Schema[]) {
    super();

    schemas.forEach((schema) => this.addSchema(schema, schema.id));
  }
}
