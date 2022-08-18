import { SchemaObject } from 'ajv';

const ReusableCommandSchema: SchemaObject = {
  $id: '#/command/ReusableCommand',
  type: ['object', 'string'],
};

export default ReusableCommandSchema;
