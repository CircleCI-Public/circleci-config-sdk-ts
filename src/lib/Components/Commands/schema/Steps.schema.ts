import { SchemaObject } from 'ajv';

const StepSchema: SchemaObject = {
  $id: '/definitions/Step',
  type: 'object',
  $merge: {
    source: {
      type: 'object',
      minProperties: 1,
      maxProperties: 1,
      additionalProperties: false,
      properties: {
        run: {
          $ref: '/commands/native/run',
        },
        checkout: {
          $ref: '/commands/native/checkout',
        },
        setup_remote_docker: {
          $ref: '/commands/native/setup_remote_docker',
        },
        save_cache: {
          $ref: '/commands/native/save_cache',
        },
        restore_cache: {
          $ref: '/commands/native/restore_cache',
        },
        store_artifacts: {
          $ref: '/commands/native/store_artifacts',
        },
        store_test_results: {
          $ref: '/commands/native/store_test_results',
        },
        persist_to_workspace: {
          $ref: '/commands/native/persist_to_workspace',
        },
        attach_workspace: {
          $ref: '/commands/native/attach_workspace',
        },
        add_ssh_keys: {
          $ref: '/commands/native/add_ssh_keys',
        },
        // when: {
        //   $ref: '/commands/native/when',
        // },
        // unless: {
        //   $ref: '/commands/native/unless',
        // },
      },
      // patternProperties: {
      //   '^[a-z][a-z0-9_-]+$': {
      //     description:
      //       'https://circleci.com/docs/2.0/reusing-config/#invoking-reusable-commands\n\nA custom command defined via the top level commands key',
      //   },
      //   '^[a-z][a-z0-9_-]+/[a-z][a-z0-9_-]+$': {
      //     description:
      //       'https://circleci.com/docs/2.0/using-orbs/#commands\n\nA custom command defined via an orb.',
      //   },
      // },
    },
    with: {
      $ref: '/custom/commands',
    },
  },
};

const StepsSchema: SchemaObject = {
  $id: '/definitions/Steps',
  type: 'array',
  minItems: 1,
  items: { $ref: '/definitions/Step' },
};

export { StepSchema, StepsSchema };
