import { SchemaObject } from 'ajv';

const CheckoutSchema: SchemaObject = {
  $id: '/commands/native/Checkout',
  type: 'object',
  properties: {
    path: {
      type: 'string',
    },
  },
};

export default CheckoutSchema;
