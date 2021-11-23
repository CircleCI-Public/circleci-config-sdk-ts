import { SchemaObject } from 'ajv';

const genParameterListSchema = (type: string): SchemaObject => {
  return {
    $id: `/parameters/${type}ParameterList`,
    type: 'object',
    properties: {
      parameters: {
        description:
          'https://circleci.com/docs/2.0/reusing-config/#using-the-parameters-declaration\n\nA map of parameter keys.',
        type: 'object',
        patternProperties: {
          '^[a-z][a-z0-9_-]+$': { $ref: `/parameters/${type}Parameter` },
        },
      },
    },
    required: ['parameters'],
  };
};

export { genParameterListSchema };
