import { SchemaObject } from 'ajv';

const genParameterListSchema = (type: string): SchemaObject => {
  return {
    $id: `/parameters/${type}ParameterList`,
    type: 'object',
    description:
      'https://circleci.com/docs/2.0/reusing-config/#using-the-parameters-declaration\n\nA map of parameter keys.',
    patternProperties: {
      '^[a-z][a-z0-9_-]+$': { $ref: `/parameters/${type}Parameters` },
    },
  };
};

export { genParameterListSchema };
