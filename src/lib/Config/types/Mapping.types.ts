import { Generable } from '../../Components';
import {
  GenerableType,
  ParameterizedComponent,
  ParameterSubtype,
} from '../exports/Mapping';

// Copied from AJV in order to avoid a dependency on it.
//   https://github.com/ajv-validator/ajv/blob/baf1475cede6d7606bb1009bbdd1a942f76cec6c/lib/types/index.ts#L7
interface _SchemaObject {
  $id?: string;
  $schema?: string;
  [x: string]: unknown; // AJV uses "any"
}

export interface SchemaObject extends _SchemaObject {
  $id?: string;
  $schema?: string;
  $async?: false;
  [x: string]: unknown; // AJV uses "any"
}

export type GenerableSubtypes = ParameterSubtype | ParameterizedComponent;

export type GenerableSubTypesMap = {
  [GenerableType.CUSTOM_PARAMETER]: {
    [key in GenerableSubtypes]: SchemaObject;
  };
  [GenerableType.CUSTOM_PARAMETERS_LIST]: {
    [key in ParameterizedComponent]: SchemaObject;
  };
};

export type OneOrMoreGenerable = Generable | Generable[];
