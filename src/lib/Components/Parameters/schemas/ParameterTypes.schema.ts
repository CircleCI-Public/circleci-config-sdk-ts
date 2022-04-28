import { SchemaObject } from 'ajv';

const StringParameterSchema: SchemaObject = {
  $id: '#/parameters/StringParameter',
  type: 'object',
  additionalProperties: false,
  description:
    'https://circleci.com/docs/2.0/reusing-config/#string\n\nA string parameter.',
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
};

const BooleanParameterSchema: SchemaObject = {
  $id: '#/parameters/BooleanParameter',
  type: 'object',
  additionalProperties: false,
  description:
    'https://circleci.com/docs/2.0/reusing-config/#boolean\n\nA boolean parameter.',
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
};

const IntegerParameterSchema: SchemaObject = {
  $id: '#/parameters/IntegerParameter',
  type: 'object',
  additionalProperties: false,
  description:
    'https://circleci.com/docs/2.0/reusing-config/#integer\n\nAn integer parameter.',
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
};

const EnumParameterSchema: SchemaObject = {
  $id: '#/parameters/EnumParameter',
  type: 'object',
  description:
    'https://circleci.com/docs/2.0/reusing-config/#enum\n\nThe `enum` parameter may be a list of any values. Use the `enum` parameter type when you want to enforce that the value must be one from a specific set of string values.',
  required: ['type', 'enum'],
  additionalProperties: false,
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

const StepsParameterSchema: SchemaObject = {
  $id: '#/parameters/StepsParameter',
  type: 'object',
  additionalProperties: false,
  description:
    'https://circleci.com/docs/2.0/reusing-config/#steps\n\nSteps are used when you have a job or command that needs to mix predefined and user-defined steps. When passed in to a command or job invocation, the steps passed as parameters are always defined as a sequence, even if only one step is provided.',
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
        $ref: '#/definitions/Step',
      },
    },
  },
};

const ExecutorParameterSchema: SchemaObject = {
  $id: '#/parameters/ExecutorParameter',
  type: 'object',
  additionalProperties: false,
  description:
    'https://circleci.com/docs/2.0/reusing-config/#steps\n\nSteps are used when you have a job or command that needs to mix predefined and user-defined steps. When passed in to a command or job invocation, the steps passed as parameters are always defined as a sequence, even if only one step is provided.',
  required: ['type'],
  properties: {
    type: {
      enum: ['executor'],
    },
    description: {
      type: 'string',
    },
    default: {
      type: 'object',
      // $ref: '/executors/Executor',
    },
  },
};

const EnvVarNameParameterSchema: SchemaObject = {
  $id: '#/parameters/EnvVarNameParameter',
  type: 'object',
  additionalProperties: false,
  description:
    'https://circleci.com/docs/2.0/reusing-config/#steps\n\nSteps are used when you have a job or command that needs to mix predefined and user-defined steps. When passed in to a command or job invocation, the steps passed as parameters are always defined as a sequence, even if only one step is provided.',
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
};

export {
  StringParameterSchema,
  BooleanParameterSchema,
  IntegerParameterSchema,
  EnumParameterSchema,
  StepsParameterSchema,
  ExecutorParameterSchema,
  EnvVarNameParameterSchema,
};
