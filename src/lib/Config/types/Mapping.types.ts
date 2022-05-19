/**
 * DFG
 */

import { SchemaObject } from 'ajv';
import {
  GenerableType,
  ParameterizedComponent,
  ParameterSubtype,
} from '../exports/Mapping';

export type GenerableSubtypes = ParameterSubtype | ParameterizedComponent;

export type GenerableSubTypesMap = {
  [GenerableType.CUSTOM_PARAMETER]: {
    [key in GenerableSubtypes]: SchemaObject;
  };
  [GenerableType.CUSTOM_PARAMETERS_LIST]: {
    [key in ParameterizedComponent]: SchemaObject;
  };
};
