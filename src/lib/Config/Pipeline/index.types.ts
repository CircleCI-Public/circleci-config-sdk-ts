export type ParameterTypeLiteral = 'string' | 'number' | 'boolean' | 'enum';
export interface PipelineParameterSchema {
  [parameterName: string]: {
    type: ParameterTypeLiteral;
    default: string | number | boolean;
    enum?: string[];
  };
}
export type PipelineParameterValueTypes = string | number | boolean;
