import * as CircleCI from '@circleci/circleci-config-sdk';
import { SchemaObject } from 'ajv';
import { GenerableSubTypesMap } from './Mapping.types';

export type ValidationResult = boolean | string;

export type ValidationMap = GenerableSubTypesMap & {
  [key in CircleCI.mapping.GenerableType]: SchemaObject;
};
