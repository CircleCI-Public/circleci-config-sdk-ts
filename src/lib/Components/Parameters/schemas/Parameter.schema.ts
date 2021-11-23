import { Schema } from 'jsonschema';

const primitiveParameterSchema: Schema = {
  id: '/parameters/PrimitiveParameter',
  type: 'object',
  oneOf: [
    {
      description:
        'https://circleci.com/docs/2.0/reusing-config/#string\n\nA string parameter.',
      type: 'object',
      required: ['type'],
      properties: {
        type: {
          enum: ['string'],
        },
        description: {
          type: 'string',
        },
        default: {
          type: 'string',
        },
      },
    },
    {
      description:
        'https://circleci.com/docs/2.0/reusing-config/#boolean\n\nA boolean parameter.',
      type: 'object',
      required: ['type'],
      properties: {
        type: {
          enum: ['boolean'],
        },
        description: {
          type: 'string',
        },
        default: {
          type: 'boolean',
        },
      },
    },
    {
      description:
        'https://circleci.com/docs/2.0/reusing-config/#integer\n\nAn integer parameter.',
      type: 'object',
      required: ['type'],
      properties: {
        type: {
          enum: ['integer'],
        },
        description: {
          type: 'string',
        },
        default: {
          type: 'integer',
        },
      },
    },
  ],
};

const enumParameterSchema: Schema = {
  id: '/parameters/EnumParameter',
  type: 'object',
  description:
    'https://circleci.com/docs/2.0/reusing-config/#enum\n\nThe `enum` parameter may be a list of any values. Use the `enum` parameter type when you want to enforce that the value must be one from a specific set of string values.',
  required: ['type', 'enum'],
  properties: {
    type: {
      enum: ['enum'],
    },
    enum: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'string',
      },
    },
    description: {
      type: 'string',
    },
    default: {
      type: 'string',
    },
  },
};

const commandParameterSchema: Schema = {
  id: '/parameters/CommandParameter',
  type: 'object',
  oneOf: [
    { $ref: '/parameters/PrimitiveParameter' },
    { $ref: '/parameters/EnumParameter' },
    {
      description:
        'https://circleci.com/docs/2.0/reusing-config/#steps\n\nSteps are used when you have a job or command that needs to mix predefined and user-defined steps. When passed in to a command or job invocation, the steps passed as parameters are always defined as a sequence, even if only one step is provided.',
      type: 'object',
      required: ['type'],
      properties: {
        type: {
          enum: ['steps'],
        },
        description: {
          type: 'string',
        },
        default: {
          type: 'array',
          items: {
            $ref: '/definitions/step',
          },
        },
      },
    },
  ],
};

const jobParameterSchema: Schema = {
  id: '/parameters/JobParameter',
  type: 'object',
  oneOf: [
    { $ref: '/parameters/CommandParameter' },
    {
      description:
        'https://circleci.com/docs/2.0/reusing-config/#executor\n\nUse an `executor` parameter type to allow the invoker of a job to decide what executor it will run on.',
      type: 'object',
      required: ['type'],
      properties: {
        type: {
          enum: ['executor'],
        },
        description: {
          type: 'string',
        },
        default: {
          type: 'string',
        },
      },
    },
  ],
};

const anyParameterSchema: Schema = {
  id: '/parameters/AnyParameter',
  type: 'object',
  oneOf: [
    { $ref: '/parameters/JobParameter' },
    {
      description:
        'https://circleci.com/docs/2.0/reusing-config/#environment-variable-name\n\nThe environment variable name parameter is a string that must match a POSIX_NAME regexp (e.g. no spaces or special characters) and is a more meaningful parameter type that enables additional checks to be performed. ',
      type: 'object',
      required: ['type'],
      properties: {
        type: {
          enum: ['env_var_name'],
        },
        description: {
          type: 'string',
        },
        default: {
          type: 'string',
          pattern: '^[a-zA-Z][a-zA-Z0-9_-]+$',
        },
      },
    },
  ],
};

const genParameterListSchema = (
  type: string,
  refs: string[] = [type],
): Schema => {
  return {
    id: `/parameters/${type}ParameterList`,
    type: 'object',
    properties: {
      parameters: {
        description:
          'https://circleci.com/docs/2.0/reusing-config/#using-the-parameters-declaration\n\nA map of parameter keys.',
        type: 'object',
        patternProperties: {
          '^[a-z][a-z0-9_-]+$': {
            oneOf: refs.map((ref) => ({ $ref: `/parameters/${ref}Parameter` })),
          },
        },
      },
    },
    required: ['parameters'],
  };
};

const anyParameterListSchema = genParameterListSchema('Any');
const jobParameterListSchema = genParameterListSchema('Job');
const commandParameterListSchema = genParameterListSchema('Command');
const primitiveParameterListSchema = genParameterListSchema('Primitive', [
  'Primitive',
  'Enum',
]);

export {
  primitiveParameterSchema,
  enumParameterSchema,
  commandParameterSchema,
  jobParameterSchema,
  anyParameterSchema,
  anyParameterListSchema,
  jobParameterListSchema,
  commandParameterListSchema,
  primitiveParameterListSchema,
};
