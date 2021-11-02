import * as CircleCI from '../src/index';
import { PipelineParameter } from '../src/lib/Config/Pipeline';
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

describe('Implement type-safe pipeline parameters', () => {
  const DockerExecutor = new CircleCI.executor.DockerExecutor(
    'cimg/base:stable',
  );
  const myJob = new CircleCI.Job('myJob', DockerExecutor);

  const stringParameter = new PipelineParameter(
    'myParameter',
    'my-string-value',
  );
  const booleanParameter = new PipelineParameter('myBoolean', true);
  const enumParameter = new PipelineParameter('myEnum', 'test', [
    'all',
    'possible',
    'values',
    'test',
  ]);

  const echoCommand = new CircleCI.commands.Run({
    command: `echo hello ${stringParameter.value}`,
  });

  if (booleanParameter.value == false) {
    myJob.addStep(echoCommand);
  }

  it('Should not add any steps given the FALSE booleanParameter', () => {
    expect(myJob.steps.length).toEqual(0);
  });
  it('Should validate string Parameter to type STRING', () => {
    expect(stringParameter.parameterType).toEqual('string');
  });
  it('Should validate boolean Parameter to type BOOLEAN', () => {
    expect(booleanParameter.parameterType).toEqual('boolean');
  });
  it('Should return the default value from an enum parameter', () => {
    expect(enumParameter.value).toEqual('test');
  });
});

describe('Generate valid Pipeline Parameter YAML', () => {
  const stringParameter = new PipelineParameter(
    'myParameter',
    'my-string-value',
  );
  const generated = stringParameter.generate();
  it('should generate valid pipeline parameter yaml', () => {
    expect(generated).toEqual({
      myParameter: {
        default: 'my-string-value',
        enum: [],
        parameterType: 'string',
      },
    });
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

describe('Add string PipelineParameter to Config', () => {
  const myConfig = new CircleCI.Config();
  const stringParameter = new PipelineParameter<string>(
    'myParameter',
    'my-string-value',
  );
  myConfig.pipeline.parameters.push(stringParameter);
  it('Should add PipelineParameter to Config', () => {
    const expected = {
      myParameter: {
        default: 'my-string-value',
        enum: [],
        parameterType: 'string',
      },
    };

    expect(myConfig.pipeline.parameters[0].generate()).toEqual(expected);
  });
});

describe('Add boolean PipelineParameter to Config', () => {
  const myConfig = new CircleCI.Config();
  const booleanParameter = new PipelineParameter<boolean>('myBoolean', true);
  myConfig.pipeline.parameters.push(booleanParameter);
  it('Should add PipelineParameter to Config', () => {
    const expected = {
      myBoolean: { default: true, enum: [], parameterType: 'boolean' },
    };

    expect(myConfig.pipeline.parameters[0].generate()).toEqual(expected);
  });
});

describe('Add enum PipelineParameter to Config', () => {
  const myConfig = new CircleCI.Config();
  const enumParameter = new PipelineParameter<string>('myEnum', 'test', [
    'all',
    'possible',
    'values',
    'test',
  ]);
  myConfig.pipeline.parameters.push(enumParameter);
  it('Should add PipelineParameter to Config', () => {
    const expected = {
      myEnum: {
        default: 'test',
        enum: ['all', 'possible', 'values', 'test'],
        parameterType: 'enum',
      },
    };

    expect(myConfig.pipeline.parameters[0].generate()).toEqual(expected);
  });
});

describe('Validate enum', () => {
  it('Should validate enum', () => {
    function returnEnum() {
      return new PipelineParameter('myEnum', 'test', [
        'all',
        'possible',
        'values',
      ]);
    }
    expect(() => {
      returnEnum();
    }).toThrow();
  });
});

describe('Add Number PipelineParameter to Config', () => {
  const myConfig = new CircleCI.Config();
  const numberParameter = new PipelineParameter<number>('myNumber', 1);
  myConfig.pipeline.parameters.push(numberParameter);
  it('Should add PipelineParameter to Config', () => {
    const expected = {
      myNumber: { default: 1, enum: [], parameterType: 'number' },
    };

    expect(myConfig.pipeline.parameters[0].generate()).toEqual(expected);
  });
});
