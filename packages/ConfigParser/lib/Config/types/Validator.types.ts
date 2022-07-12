import { GenerableType } from '@circleci/circleci-config-sdk/lib/Config/exports/Mapping';
import { SchemaObject } from 'ajv';
import { GenerableSubTypesMap } from './Mapping.types';

export type ValidationResult = boolean | string;

export type ValidationMap = GenerableSubTypesMap & {
  [key in GenerableType]: SchemaObject;
};
