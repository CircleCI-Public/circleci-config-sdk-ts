import CircleCI from '../src/index';
import * as YAML from 'yaml';

describe('Generate a Setup workflow config', () => {
  const myConfig = new CircleCI.Config(true).stringify();
  it('Should produce a blank config with Setup set to true', () => {
    const expected = {
      version: 2.1,
      setup: true,
      executors: {},
      jobs: {},
      workflows: {},
    };
    expect(YAML.parse(myConfig)).toEqual(expected);
  });
});
