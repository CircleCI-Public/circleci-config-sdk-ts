import { Generable } from '../../Components';
import { GenerableSubtypes } from '../types/Mapping.types';
import { GenerableType } from './Mapping';
import { Validator } from './Validator';

let logParsing = false;
let parseStack: string[] = [];

export function parseGenerable<
  InputShape,
  OutputGenerable extends Generable | Generable[],
>(
  component: GenerableType,
  input: unknown,
  parse: (args: InputShape) => OutputGenerable | undefined,
  name?: string,
  subtype?: GenerableSubtypes,
): OutputGenerable {
  parseStack.push(`${component}${name ? `:${name}` : ''}`);

  if (logParsing) {
    console.log(`${parseStack.join('/')}`);
  }

  const valid = Validator.validateGenerable(component, input || null, subtype);

  if (valid !== true) {
    throw errorParsing(`Failed to validate: ${valid}`);
  }

  const result = parse(input as InputShape);

  if (!result) {
    throw errorParsing();
  }

  parseStack.pop();

  return result;
}

export function errorParsing(message?: string): Error {
  const stack = parseStack.join('/');

  parseStack = [];

  return new Error(`Error while parsing - ${stack}\n${message}`);
}

export function setLogParsing(shouldLog: boolean): void {
  logParsing = shouldLog;
}
