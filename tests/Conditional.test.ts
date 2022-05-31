import * as CircleCI from '../src/index';
import { GenerableType } from '../src/lib/Config/exports/Mapping';

const { and, or, not, equal, conditional } = CircleCI.logic;

describe('Generate Truthy Condition', () => {
  it('true should be truthy', () => {
    expect(new conditional.Truthy(true).evaluate()).toBeTruthy();
  });

  it('A string with content should be truthy', () => {
    expect(new conditional.Truthy('content').evaluate()).toBeTruthy();
  });

  it('An empty string should be falsy', () => {
    expect(new conditional.Truthy('').evaluate()).toBeFalsy();
  });

  it('false should be falsy', () => {
    expect(new conditional.Truthy(false).evaluate()).toBeFalsy();
  });

  it('0 should be falsy', () => {
    expect(new conditional.Truthy(0).evaluate()).toBeFalsy();
  });
});

describe('Generate basic conditionals', () => {
  it('true or false should be true', () => {
    const condition = or(true, false);

    expect(condition.generableType).toBe(GenerableType.OR);
    expect(condition.evaluate()).toBeTruthy();
  });

  it('A number should be equal to itself as a string', () => {
    const condition = equal(14, '14');

    expect(condition.generableType).toBe(GenerableType.EQUAL);
    expect(condition.evaluate()).toBeTruthy();
  });

  it('Opposite booleans should not be equal', () => {
    expect(equal(false, true).evaluate()).toBeFalsy();
  });

  it('Same booleans should be equal', () => {
    const condition = and(true, true);

    expect(condition.generableType).toBe(GenerableType.AND);
    expect(condition.evaluate()).toBeTruthy();
  });

  it('False notted should be true', () => {
    const condition = not(false);

    expect(condition.generableType).toBe(GenerableType.NOT);
    expect(condition.evaluate()).toBeTruthy();
  });

  it('True notted should be false', () => {
    expect(not(true).evaluate()).toBeFalsy();
  });
});

describe('Generate complex conditionals', () => {
  it('Complex combination of conditions', () => {
    expect(and(not(false), or(false, true)).evaluate()).toBeTruthy();
  });
});
