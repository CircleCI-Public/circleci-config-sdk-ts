import { parse } from 'yaml';
import * as CircleCI from '../src/index';
import { DockerExecutor } from '../src/lib/Components/Executors';
import { ParameterizedJob } from '../src/lib/Components/Job';
import { CustomParametersList } from '../src/lib/Components/Parameters';
import {
  CustomCommand,
  ReusableExecutor,
} from '../src/lib/Components/Reusable';
import {
  CommandOrbUsage,
  ExecutorOrbUsage,
  JobOrbUsage,
} from '../src/lib/Orb/exports/Components';
import { OrbImportDirective } from '../src/lib/Orb/exports/OrbImport';

describe('Use an OrbImport within a config', () => {
  const orbName = 'my-orb';
  const orbNamespace = 'circleci';
  const orbVersion = '1.0.0';
  const orbImport: OrbImportDirective = {
    alias: orbName,
    namespace: orbNamespace,
    name: orbName,
    version: orbVersion,
  };
  const exampleOrb = new CircleCI.orb.OrbImport(
    orbName,
    orbNamespace,
    orbName,
    orbVersion,
  );

  it('Should match expected shape', () => {
    expect(exampleOrb.generate()).toEqual({
      [orbName]: `${orbNamespace}/${orbName}@${orbVersion}`,
    });
  });

  const config = new CircleCI.Config();

  config.importOrb(exampleOrb);

  it('Should produce a config with Orb import and usages', () => {
    const expected = {
      version: 2.1,
      setup: false,
      jobs: {},
      workflows: {},
      orbs: {
        [orbName]: `${orbNamespace}/${orbName}@${orbVersion}`,
      },
    };
    expect(parse(config.generate())).toEqual(expected);
  });

  it('Orb Job should generate as string without parameters', () => {
    const orbJobUsage = new JobOrbUsage(
      orbImport,
      new ParameterizedJob(
        'my-job',
        new DockerExecutor('cimg/base'),
        new CustomParametersList(),
      ),
    );

    expect(orbJobUsage.generate()).toEqual({ 'my-orb/my-job': undefined });
  });

  it('Orb Command should generate as string without parameters', () => {
    const orbJobUsage = new CommandOrbUsage(
      orbImport,
      new CustomCommand('my-command'),
    );

    expect(orbJobUsage.generate()).toEqual({ 'my-orb/my-command': undefined });
  });

  it('Orb Executor should generate as string without parameters', () => {
    const orbJobUsage = new ExecutorOrbUsage(
      orbImport,
      new ReusableExecutor('my-executor', new DockerExecutor('cimg/base')),
    );

    expect(orbJobUsage.generate()).toEqual({ 'my-orb/my-executor': undefined });
  });
});
