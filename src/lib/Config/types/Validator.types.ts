import { SchemaObject } from 'ajv';
import { GenerableType } from '../exports/Mapping';
import { GenerableSubTypesMap } from './Mapping.types';

export type ValidationResult = boolean | string;

export type ValidationMap = GenerableSubTypesMap & {
  [key in GenerableType]: SchemaObject;
};
