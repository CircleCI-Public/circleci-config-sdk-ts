import * as CircleCI from '../src/index';

describe('Instantiate Workflow', () => {
  const docker = new CircleCI.executors.DockerExecutor('cimg/node:lts');
  const helloWorld = new CircleCI.commands.Run({
    command: 'echo hello world',
  });

  const job = new CircleCI.Job('my-job', docker, [helloWorld]);
  const myWorkflow = new CircleCI.Workflow('my-workflow', [job]);

  const generatedWorkflow = myWorkflow.generate();
  const expected = { 'my-workflow': { jobs: [{ 'my-job': undefined }] } };

  it('Should match the expected output', () => {
    expect(generatedWorkflow).toEqual(expected);
  });

  it('Should validate', () => {
    expect(
      CircleCI.Validator.validateGenerable(
        CircleCI.mapping.GenerableType.WORKFLOW,
        expected['my-workflow'],
      ),
    ).toEqual(true);
  });
});

describe('Instantiate Workflow with a custom name', () => {
  const docker = new CircleCI.executors.DockerExecutor('cimg/node:lts');
  const helloWorld = new CircleCI.commands.Run({
    command: 'echo hello world',
  });
  const job = new CircleCI.Job('my-job', docker, [helloWorld]);
  const myWorkflow = new CircleCI.Workflow('my-workflow');
  myWorkflow.addJob(job, { name: 'custom-name' });
  const generatedWorkflow = myWorkflow.generate();
  const expected = {
    'my-workflow': { jobs: [{ 'my-job': { name: 'custom-name' } }] },
  };
  it('Should match the expected output', () => {
    expect(generatedWorkflow).toEqual(expected);
  });
});

describe('Instantiate a new Workflow with a job in the constructor', () => {
  const docker = new CircleCI.executors.DockerExecutor('cimg/node:lts');
  const helloWorld = new CircleCI.commands.Run({
    command: 'echo hello world',
  });
  const job = new CircleCI.Job('my-job', docker, [helloWorld]);
  const myWorkflow = new CircleCI.Workflow('my-workflow', [job]);
  const generatedWorkflow = myWorkflow.generate();
  const expected = {
    'my-workflow': { jobs: [{ 'my-job': {} }] },
  };
  it('Should match the expected output', () => {
    expect(generatedWorkflow).toEqual(expected);
  });
});

describe('Parse a workflow', () => {
  const docker = new CircleCI.executors.DockerExecutor('cimg/node:lts');
  const helloWorld = new CircleCI.commands.Run({
    command: 'echo hello world',
  });
  const job = new CircleCI.Job('my-job', docker, [helloWorld]);
  const myWorkflow = new CircleCI.Workflow('my-workflow', [job]);

  const workflowListShape = {
    'my-workflow': { jobs: [{ 'my-job': {} }] },
  };

  it('Should match the expected output', () => {
    expect(
      CircleCI.parsers.parseWorkflowList(workflowListShape, [job])[0],
    ).toEqual(myWorkflow);
  });

  it('Should throw error if no job is provided', () => {
    expect(() => {
      CircleCI.parsers.parseWorkflowList(workflowListShape, []);
    }).toThrowError('Job my-job not found in config');
  });
});

describe('Instantiate a new Workflow with a workflow job added manually', () => {
  const docker = new CircleCI.executors.DockerExecutor('cimg/node:lts');
  const helloWorld = new CircleCI.commands.Run({
    command: 'echo hello world',
  });
  const job = new CircleCI.Job('my-job', docker, [helloWorld]);
  const workflowJob = new CircleCI.WorkflowJob(job);
  const myWorkflow = new CircleCI.Workflow('my-workflow', [workflowJob]);

  const generatedWorkflow = myWorkflow.generate();
  const expected = {
    'my-workflow': { jobs: [{ 'my-job': {} }] },
  };
  it('Should match the expected output', () => {
    expect(generatedWorkflow).toEqual(expected);
  });
});

describe('Instantiate a new Workflow with a when condition', () => {
  const docker = new CircleCI.executors.DockerExecutor('cimg/node:lts');
  const helloWorld = new CircleCI.commands.Run({
    command: 'echo hello world',
  });
  const job = new CircleCI.Job('my-job', docker, [helloWorld]);
  const workflowJob = new CircleCI.WorkflowJob(job);
  const { and, or, equal, not } = CircleCI.logic;
  const myWorkflow = new CircleCI.Workflow(
    'my-workflow',
    [workflowJob],
    new CircleCI.logic.When(
      or(
        and(
          '<< parameters.should_retry >>',
          equal('<< parameters.attempt >>', 3),
        ),
        not(equal('<< parameters.user >>', 'bob')),
      ),
    ),
  );

  const generatedWorkflow = myWorkflow.generate();
  const expected = {
    'my-workflow': {
      when: {
        or: [
          {
            and: [
              '<< parameters.should_retry >>',
              { equal: ['<< parameters.attempt >>', 3] },
            ],
          },
          {
            not: { equal: ['<< parameters.user >>', 'bob'] },
          },
        ],
      },
      jobs: [{ 'my-job': {} }],
    },
  };

  it('Should match the expected output', () => {
    expect(generatedWorkflow).toEqual(expected);
  });
  it('Should have the correct static properties', () => {
    expect(workflowJob.generableType).toBe(
      CircleCI.mapping.GenerableType.WORKFLOW_JOB,
    );
  });
});

describe('Utilize workflow job filters', () => {
  const docker = new CircleCI.executors.DockerExecutor('cimg/node:lts');
  const helloWorld = new CircleCI.commands.Run({
    command: 'echo hello world',
  });
  const job = new CircleCI.Job('my-job', docker, [helloWorld]);

  it('Should create branch filter', () => {
    const myWorkflow = new CircleCI.Workflow('my-workflow');
    myWorkflow.addJob(job, {
      filters: { branches: { only: ['/server\\/.*/'] } },
    });
    const generatedWorkflowJob = myWorkflow.jobs[0].generate();
    const expected = {
      'my-job': { filters: { branches: { only: ['/server\\/.*/'] } } },
    };
    expect(generatedWorkflowJob).toEqual(expected);
  });

  it('Should create tag filter', () => {
    const myWorkflow = new CircleCI.Workflow('my-workflow');
    myWorkflow.addJob(job, { filters: { tags: { only: ['/^v.*/'] } } });
    const generatedWorkflowJob = myWorkflow.jobs[0].generate();
    const expected = {
      'my-job': { filters: { tags: { only: ['/^v.*/'] } } },
    };
    expect(generatedWorkflowJob).toEqual(expected);
  });
});

describe('Utilize workflow job matrix', () => {
  const docker = new CircleCI.executors.DockerExecutor('cimg/node:lts');
  const helloWorld = new CircleCI.commands.Run({
    command: 'echo hello world',
  });
  const job = new CircleCI.Job('my-job', docker, [helloWorld]);

  it('Should create a parameter matrix', () => {
    const myWorkflow = new CircleCI.Workflow('my-workflow');
    myWorkflow.addJob(job, {
      matrix: {
        versions: ['1.0.0', '2.0.0'],
      },
    });
    const generatedWorkflowJob = myWorkflow.jobs[0].generate();
    const expected = {
      'my-job': {
        matrix: {
          parameters: {
            versions: ['1.0.0', '2.0.0'],
          },
        },
      },
    };
    expect(generatedWorkflowJob).toEqual(expected);
  });
});

describe('Instantiate Workflow with a manual approval job', () => {
  const docker = new CircleCI.executors.DockerExecutor('cimg/node:lts');
  const helloWorld = new CircleCI.commands.Run({
    command: 'echo hello world',
  });
  const jobTest = new CircleCI.Job('test-job', docker, [helloWorld]);
  const jobDeploy = new CircleCI.Job('deploy-job', docker, [helloWorld]);

  const myWorkflow = new CircleCI.Workflow('my-workflow');
  myWorkflow.addJob(jobTest);
  myWorkflow.addJob(new CircleCI.Job('on-hold', docker), {
    type: 'approval',
  });
  myWorkflow.addJob(jobDeploy);
  it('Should match the expected output', () => {
    const expected = {
      'my-workflow': {
        jobs: [
          { 'test-job': {} },
          { 'on-hold': { type: 'approval' } },
          { 'deploy-job': {} },
        ],
      },
    };
    const generatedWorkflow = myWorkflow.generate();
    expect(generatedWorkflow).toEqual(expected);
  });
});

describe('Instantiate a Workflow with sequential jobs', () => {
  const docker = new CircleCI.executors.DockerExecutor('cimg/node:lts');
  const helloWorld = new CircleCI.commands.Run({
    command: 'echo hello world',
  });
  const jobA = new CircleCI.Job('my-job-A', docker, [helloWorld]);
  const jobB = new CircleCI.Job('my-job-B', docker, [helloWorld]);
  const myWorkflow = new CircleCI.Workflow('my-workflow');
  myWorkflow.addJob(jobA);
  myWorkflow.addJob(jobB, { requires: ['my-job-A'] });
  it('Should match the expected output', () => {
    const expected = {
      'my-workflow': {
        jobs: [{ 'my-job-A': {} }, { 'my-job-B': { requires: ['my-job-A'] } }],
      },
    };
    const generatedWorkflow = myWorkflow.generate();
    expect(generatedWorkflow).toEqual(expected);
  });
});

describe('Instantiate a Workflow with 2 jobs', () => {
  const docker = new CircleCI.executors.DockerExecutor('cimg/node:lts');
  const helloWorld = new CircleCI.commands.Run({ command: 'echo hello world' });
  const jobA = new CircleCI.Job('my-job-A', docker, [helloWorld]);
  const jobB = new CircleCI.Job('my-job-B', docker, [helloWorld]);
  const myWorkflow = new CircleCI.Workflow('my-workflow');
  myWorkflow.addJob(jobA, { myParam: 'my-value' });
  myWorkflow.addJob(jobB);
  it('Should match the expected output', () => {
    const expected = {
      'my-workflow': {
        jobs: [{ 'my-job-A': { myParam: 'my-value' } }, { 'my-job-B': {} }],
      },
    };
    const generatedWorkflow = myWorkflow.generate();
    expect(generatedWorkflow).toEqual(expected);
  });

  it('Should have the correct static properties', () => {
    expect(myWorkflow.generableType).toBe(
      CircleCI.mapping.GenerableType.WORKFLOW,
    );
  });
});

describe('Add a job to a workflow with a custom name parameter', () => {
  const docker = new CircleCI.executors.DockerExecutor('cimg/node:lts');
  const helloWorld = new CircleCI.commands.Run({
    command: 'echo hello world',
  });
  const job = new CircleCI.Job('my-job', docker, [helloWorld]);
  const myWorkflow = new CircleCI.Workflow('my-workflow');
  myWorkflow.addJob(job, { name: 'custom-name' });
  it('Should match the expected output', () => {
    const expected = {
      'my-workflow': { jobs: [{ 'my-job': { name: 'custom-name' } }] },
    };
    const generatedWorkflow = myWorkflow.generate();
    expect(generatedWorkflow).toEqual(expected);
  });
});
