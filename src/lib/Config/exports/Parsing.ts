import { GenerableType } from './Mapping';

let logParsing = false;
const parseStack: string[] = [];

export function beginParsing(component: GenerableType, name?: string): void {
  parseStack.push(`${component}${name ? `:${name}` : ''}`);

  if (logParsing) {
    console.log(`${parseStack.join('/')}`);
  }
}

export function endParsing(): void {
  parseStack.pop();
}

export function errorParsing(message?: string): Error {
  const stack = parseStack.join('/');

  return new Error(`Error while parsing - ${stack}\n${message}`);
}

export function setLogParsing(shouldLog: boolean): void {
  logParsing = shouldLog;
}
