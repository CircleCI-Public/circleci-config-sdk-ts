import { SchemaObject } from 'ajv';

const CheckoutSchema: SchemaObject = {
  $id: '/commands/native/checkout',
  type: 'object',
  properties: {
    path: {
      type: 'string',
    },
  },
};

export default CheckoutSchema;
