import { parse } from 'yaml';
import {
  CustomEnumParameter,
  CustomParameter,
  CustomParametersList,
} from '../src/lib/Components/Parameters';

describe('Parse yaml parameters and validate', () => {
  it('Should validate parameters', () => {
    const parameters = parse(`parameters: 
      axis:
        type: enum
        default: 'x'
        enum: [x, y, z]
      angle:
        type: integer
        default: 90`);

    const result = CustomParametersList.validate(parameters, 'primitive');

    expect(result?.valid).toBeTruthy();
  });

  it('Should validate primitive parameter', () => {
    const parameter = parse(`
    type: integer
    default: 2021`);

    const result = CustomParameter.validate(parameter, 'primitive');

    expect(result?.valid).toBeTruthy();
  });

  it('Should validate enum parameter', () => {
    const parameter = parse(`
    type: enum
    default: 'x'
    enum: [x, y, z]`);

    const result = CustomEnumParameter.validate(parameter);

    expect(result.valid).toBeTruthy();
  });
});
