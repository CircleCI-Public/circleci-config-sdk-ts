import * as CircleCI from '../src/index';
// Enforce local testing
delete process.env.CIRCLECI;
describe('Check built-in pipeline parameters', () => {
  const myConfig = new CircleCI.Config();
  it('Should return pipeline id', () => {
    // On a local machine the pipeline id should return local
    expect(myConfig.pipeline.id).toEqual('local');
  });
  it('Should return pipeline number', () => {
    // On a local machine the pipeline number should return 0
    expect(myConfig.pipeline.number).toEqual(0);
  });
  it('Should return git tag', () => {
    // On a local machine the pipeline git tag should be local
    expect(myConfig.pipeline.git().tag).toEqual('local');
  });
  it('Should return git branch', () => {
    // On a local machine the pipeline git branch should be local
    expect(myConfig.pipeline.git().branch).toEqual('local');
  });
  it('Should return git revision', () => {
    // On a local machine the pipeline git revision should be 40 char long
    expect(myConfig.pipeline.git().revision.length).toEqual(40);
  });
  it('Should return git base_revision', () => {
    // On a local machine the pipeline git base_revision should be 40 char long
    expect(myConfig.pipeline.git().base_revision.length).toEqual(40);
  });
  it('Should return project git_url', () => {
    // On a local machine the project git_url should be "git.local"
    expect(myConfig.pipeline.project().git_url).toEqual('git.local');
  });
  it('Should return project type', () => {
    // On a local machine the project git_url should be "local"
    expect(myConfig.pipeline.project().vcs).toEqual('local');
  });
});

describe('Check built-in pipeline parameters exceptions', () => {
  process.env.CIRCLECI = 'true';
  const myConfig = new CircleCI.Config();
  it('Should return pipeline id', () => {
    // On a local machine the pipeline id should return local
    expect(myConfig.pipeline.id).toEqual('NOT YET SUPPORTED');
  });
  it('Should return pipeline number', () => {
    // On a local machine the pipeline number should return 0
    expect(myConfig.pipeline.number).toEqual(-1);
  });
});

describe('Check Pipeline Project Parameters (local)', () => {
  it('Should create a local pipeline project parameter set', () => {
    process.env.CIRCLE_REPOSITORY_URL = '';
    process.env.CIRCLECI = '';
    const localProject = new CircleCI.Pipeline();
    expect(localProject.project().git_url).toEqual('git.local');
    expect(localProject.project().vcs).toEqual('local');
  });
});

describe('Check Pipeline Project Parameters (mock GitHub)', () => {
  it('Should generate pipeline values for GitHub', () => {
    process.env.CIRCLECI = 'true';
    process.env.CIRCLE_REPOSITORY_URL =
      'https://github.com/CircleCI-Public/circleci-config-sdk-ts';
    const GHProject = new CircleCI.Pipeline();
    expect(GHProject.project().git_url).toEqual(
      'https://github.com/CircleCI-Public/circleci-config-sdk-ts',
    );
  });
});

describe('Check Pipeline Project Parameters (mock BitBucket)', () => {
  it('Should generate pipeline values for GitHub', () => {
    process.env.CIRCLECI = 'true';
    process.env.CIRCLE_REPOSITORY_URL = 'https://bitbucket.com/org/repo';
    const GHProject = new CircleCI.Pipeline();
    expect(GHProject.project().git_url).toEqual(
      'https://bitbucket.com/org/repo',
    );
    expect(GHProject.project().vcs).toEqual('bitbucket');
  });
});

describe('Check Pipeline Project Parameters (mock Unsupported)', () => {
  it('Should generate pipeline values for GitHub', () => {
    process.env.CIRCLECI = 'true';
    const GHProject = new CircleCI.Pipeline();
    expect(() => {
      process.env.CIRCLE_REPOSITORY_URL =
        'https://notarealwebsite.com/org/repo';
      GHProject.project().vcs;
    }).toThrow(
      'Unrecognized VCS provider while obtaining Pipeline.Project.VCS from URL https://notarealwebsite.com/org/repo',
    );
  });
});
