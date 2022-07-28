import { SchemaObject } from 'ajv';
import * as CircleCI from '@circleci/circleci-config-sdk';

export type GenerableSubtypes =
  | CircleCI.mapping.ParameterSubtype
  | CircleCI.mapping.ParameterizedComponent;

export type GenerableSubTypesMap = {
  [CircleCI.mapping.GenerableType.CUSTOM_PARAMETER]: {
    [key in GenerableSubtypes]: SchemaObject;
  };
  [CircleCI.mapping.GenerableType.CUSTOM_PARAMETERS_LIST]: {
    [key in CircleCI.mapping.ParameterizedComponent]: SchemaObject;
  };
};
export type OneOrMoreGenerable =
  | CircleCI.types.config.Generable
  | CircleCI.types.config.Generable[];
