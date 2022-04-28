import { SchemaObject } from 'ajv';

const ReusableCommandSchema: SchemaObject = {
  $id: '#/command/ReusableCommand',
  $ref: '#/custom/command',
};

export default ReusableCommandSchema;
