import { logic } from '../src/index';
import { Truthy } from '../src/lib/Components/Logic/exports/conditions/Truthy';

describe('Generate conditionals', () => {
  const { and, or, not, equal } = logic;

  it('true should be truthy', () => {
    expect(new Truthy(true).evaluate()).toBeTruthy();
  });

  it('A string with content should be truthy', () => {
    expect(new Truthy('content').evaluate()).toBeTruthy();
  });

  it('An empty string should be falsy', () => {
    expect(new Truthy('').evaluate()).toBeFalsy();
  });

  it('false should be falsy', () => {
    expect(new Truthy(false).evaluate()).toBeFalsy();
  });

  it('0 should be falsy', () => {
    expect(new Truthy(0).evaluate()).toBeFalsy();
  });

  it('true or false should be true', () => {
    expect(or(true, false).evaluate()).toBeTruthy();
  });

  it('A number should be equal to itself as a string', () => {
    expect(equal(14, '14').evaluate()).toBeTruthy();
  });

  it('Opposite booleans should not be equal', () => {
    expect(equal(false, true).evaluate()).toBeFalsy();
  });

  it('Same booleans should be equal', () => {
    expect(and(true, true).evaluate()).toBeTruthy();
  });

  it('False notted should be true', () => {
    expect(not(false).evaluate()).toBeTruthy();
  });

  it('Complex combination of conditions', () => {
    expect(and(not(false), or(false, true)).evaluate()).toBeTruthy();
  });
});
