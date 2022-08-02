import * as CircleCI from '@circleci/circleci-config-sdk';
import { GenerableSubtypes, OneOrMoreGenerable } from '../types/Mapping.types';
import { Validator } from './Validator';

let logParsing = false;
let parseStack: string[] = [];

export function parseGenerable<
  InputShape,
  OutputGenerable extends OneOrMoreGenerable,
  GenerableDependencies extends Record<string, OneOrMoreGenerable> = never,
>(
  component: CircleCI.mapping.GenerableType,
  input: unknown,
  parse: (
    args: InputShape,
    children: GenerableDependencies,
  ) => OutputGenerable | undefined,
  parseDependencies?: (args: InputShape) => GenerableDependencies,
  name?: string,
  subtype?: GenerableSubtypes,
): OutputGenerable {
  parseStack.push(`${component}${name ? `:${name}` : ''}`);

  if (logParsing) {
    console.log(`${parseStack.join('/')}`);
  }

  const inputShape = input as InputShape;
  const children = parseDependencies
    ? parseDependencies(inputShape)
    : ({} as GenerableDependencies);

  const valid = Validator.validateGenerable(component, input || null, subtype);

  if (valid !== true) {
    throw errorParsing(`Failed to validate: ${valid}`);
  }

  const result = parse(inputShape, children);

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
