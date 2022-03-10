import { SchemaObject } from 'ajv';

const StepsSchema: SchemaObject = {
  $id: '/definitions/Step',
  type: 'object',
  anyOf: [
    {
      // $ref: '#/definitions/builtinSteps/documentation/checkout',
      enum: ['checkout'],
    },
    {
      // $ref: '#/definitions/builtinSteps/documentation/setup_remote_docker',
      enum: ['setup_remote_docker'],
    },
    {
      // $ref: '#/definitions/builtinSteps/documentation/add_ssh_keys',
      enum: ['add_ssh_keys'],
    },
    {
      description:
        'https://circleci.com/docs/2.0/reusing-config/#invoking-reusable-commands\n\nA custom command defined via the top level commands key',
      type: 'string',
      pattern: '^[a-z][a-z0-9_-]+$',
    },
    {
      description:
        'https://circleci.com/docs/2.0/using-orbs/#commands\n\nA custom command defined via an orb.',
      type: 'string',
      pattern: '^[a-z][a-z0-9_-]+/[a-z][a-z0-9_-]+$',
    },
    {
      type: 'object',
      minProperties: 1,
      maxProperties: 1,
      properties: {
        run: {
          $ref: '/commands/native/Run',
        },
        checkout: {
          $ref: '/commands/native/Checkout',
        },
        setup_remote_docker: {
          $ref: '/commands/native/SetupRemoteDocker',
        },
        save_cache: {
          $ref: '/commands/native/cache/Save',
        },
        restore_cache: {
          $ref: '/commands/native/cache/Restore',
        },
        store_artifacts: {
          $ref: '/commands/native/StoreArtifacts',
        },
        store_test_results: {
          $ref: '/commands/native/StoreTestResults',
        },
        persist_to_workspace: {
          $ref: '/commands/native/workspace/Persist',
        },
        attach_workspace: {
          $ref: '/commands/native/workspace/Attach',
        },
        add_ssh_keys: {
          $ref: '/commands/native/AddSSHKeys',
        },
        // when: {
        //   $ref: '/commands/native/when',
        // },
        // unless: {
        //   $ref: '/commands/native/unless',
        // },
      },
      patternProperties: {
        '^[a-z][a-z0-9_-]+$': {
          description:
            'https://circleci.com/docs/2.0/reusing-config/#invoking-reusable-commands\n\nA custom command defined via the top level commands key',
        },
        '^[a-z][a-z0-9_-]+/[a-z][a-z0-9_-]+$': {
          description:
            'https://circleci.com/docs/2.0/using-orbs/#commands\n\nA custom command defined via an orb.',
        },
      },
    },
  ],
};

export default StepsSchema;
