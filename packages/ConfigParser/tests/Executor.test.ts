import * as CircleCI from '@circleci/circleci-config-sdk';
import * as ConfigParser from '../index';

describe('Parse a Docker executor', () => {
  const docker = new CircleCI.executors.DockerExecutor('cimg/node:lts');
  const expectedShape = {
    docker: [{ image: 'cimg/node:lts' }],
    resource_class: 'medium',
  };

  it('Should validate', () => {
    expect(
      ConfigParser.Validator.validateGenerable(
        CircleCI.mapping.GenerableType.DOCKER_EXECUTOR,
        expectedShape,
      ),
    ).toEqual(true);
  });
  it('Should parse', () => {
    expect(ConfigParser.parsers.parseExecutor(expectedShape)).toEqual(docker);
  });
});

describe('Parse a Machine executor', () => {
  const machine = new CircleCI.executors.MachineExecutor();
  const expectedShape = {
    machine: { image: 'ubuntu-2004:202010-01' },
    resource_class: 'medium',
  };
  it('Should validate', () => {
    expect(
      ConfigParser.Validator.validateGenerable(
        CircleCI.mapping.GenerableType.MACHINE_EXECUTOR,
        expectedShape,
      ),
    ).toEqual(true);
  });

  it('Should parse', () => {
    expect(ConfigParser.parsers.parseExecutor(expectedShape)).toEqual(machine);
  });
});

describe('Parse a MacOS Executor', () => {
  const macos = new CircleCI.executors.MacOSExecutor('13.0.0');
  const expectedShape = {
    macos: {
      xcode: '13.0.0',
    },
    resource_class: 'medium',
  };

  const macosLarge = new CircleCI.executors.MacOSExecutor('13.0.0', 'large');
  const expectedShapeLarge = {
    macos: {
      xcode: '13.0.0',
    },
    resource_class: 'large',
  };

  it('Should validate', () => {
    expect(
      ConfigParser.Validator.validateGenerable(
        CircleCI.mapping.GenerableType.MACOS_EXECUTOR,
        expectedShape,
      ),
    ).toEqual(true);
  });

  it('Should parse', () => {
    expect(ConfigParser.parsers.parseExecutor(expectedShape)).toEqual(macos);
  });

  it('Should validate', () => {
    expect(
      ConfigParser.Validator.validateGenerable(
        CircleCI.mapping.GenerableType.MACOS_EXECUTOR,
        expectedShapeLarge,
      ),
    ).toEqual(true);
  });

  it('Should parse', () => {
    expect(ConfigParser.parsers.parseExecutor(expectedShapeLarge)).toEqual(
      macosLarge,
    );
  });
});

/**
  This test is an edge case where the shell parameter is manually removed from the executor
  Parsing is not applicable to this test
*/

describe('Parse Windows Executor', () => {
  const windows = new CircleCI.executors.WindowsExecutor();

  const expectedShape = {
    machine: {
      image: 'windows-server-2019-vs2019:stable',
    },
    resource_class: 'windows.medium',
  };

  it('Should validate', () => {
    expect(
      ConfigParser.Validator.validateGenerable(
        CircleCI.mapping.GenerableType.WINDOWS_EXECUTOR,
        expectedShape,
      ),
    ).toEqual(true);
  });

  it('Should parse', () => {
    expect(ConfigParser.parsers.parseExecutor(expectedShape)).toEqual(windows);
  });

  it('Should throw error if fails validation', () => {
    expect(() => {
      ConfigParser.parsers.parseExecutor({ not_an_executor: {} });
    }).toThrowError('No executor found.');
  });
});

describe('Parse a 2xlarge Docker Executor', () => {
  const xxlDocker = new CircleCI.executors.DockerExecutor(
    'cimg/node:lts',
    '2xlarge',
  );
  const expectedShape = {
    docker: [{ image: 'cimg/node:lts' }],
    resource_class: '2xlarge',
  };
  it('Should validate', () => {
    expect(
      ConfigParser.Validator.validateGenerable(
        CircleCI.mapping.GenerableType.DOCKER_EXECUTOR,
        expectedShape,
      ),
    ).toEqual(true);
  });

  it('Should parse', () => {
    expect(ConfigParser.parsers.parseExecutor(expectedShape)).toEqual(
      xxlDocker,
    );
  });
});

describe('Parse a Large Machine Executor', () => {
  const machineLarge = new CircleCI.executors.MachineExecutor('large');
  const expectedShapeLarge = {
    machine: {
      image: 'ubuntu-2004:202010-01',
    },
    resource_class: 'large',
  };

  it('Should match the expected large machine', () => {
    expect(machineLarge.generate()).toEqual(expectedShapeLarge);
  });

  it('Should validate the large machine', () => {
    expect(
      ConfigParser.Validator.validateGenerable(
        CircleCI.mapping.GenerableType.MACHINE_EXECUTOR,
        expectedShapeLarge,
      ),
    ).toEqual(true);
  });

  it('Should parse the large machine', () => {
    expect(ConfigParser.parsers.parseExecutor(expectedShapeLarge)).toEqual(
      machineLarge,
    );
  });
});

describe('Parse a Medium Machine Executor', () => {
  const machineMedium = new CircleCI.executors.MachineExecutor('medium');
  const expectedShapeMedium = {
    machine: {
      image: 'ubuntu-2004:202010-01',
    },
    resource_class: 'medium',
  };
  it('Should validate the medium machine', () => {
    expect(
      ConfigParser.Validator.validateGenerable(
        CircleCI.mapping.GenerableType.MACHINE_EXECUTOR,
        expectedShapeMedium,
      ),
    ).toEqual(true);
  });

  it('Should parse the medium machine', () => {
    expect(ConfigParser.parsers.parseExecutor(expectedShapeMedium)).toEqual(
      machineMedium,
    );
  });
});

describe('Parse a Reusable Executor with Parameters', () => {
  const machine = new CircleCI.executors.MachineExecutor('large');
  const reusable = new CircleCI.reusable.ReusableExecutor(
    'default',
    machine,
    new CircleCI.parameters.CustomParametersList(),
  );
  const expectedUsageShape = {
    executor: 'default',
  };
  const executorsList = {
    default: {
      machine: {
        image: 'ubuntu-2004:202010-01',
      },
      resource_class: 'large',
      parameters: {},
    },
  };

  const myConfig = new CircleCI.Config();
  myConfig.addReusableExecutor(reusable);

  it('Should throw error during parsing', () => {
    expect(() => {
      ConfigParser.parsers.parseExecutor(expectedUsageShape);
    }).toThrowError('Reusable executor default not found in config');
  });

  it('Should validate shapeless', () => {
    const expectedShapeless = {
      executor: 'default',
    };
    expect(
      ConfigParser.Validator.validateGenerable(
        CircleCI.mapping.GenerableType.REUSED_EXECUTOR,
        expectedShapeless,
      ),
    ).toEqual(true);
  });

  it('Should produce a config with executors', () => {
    expect(ConfigParser.parsers.parseReusableExecutors(executorsList)).toEqual(
      myConfig.executors,
    );
  });
});

describe('Validate Config with Reusable Executor', () => {
  const myConfig = new CircleCI.Config();

  const machine = new CircleCI.executors.MachineExecutor('large');
  const dockerBase = new CircleCI.executors.DockerExecutor(
    'cimg/base:<< parameters.tag >>',
  );
  const reusableMachine = new CircleCI.reusable.ReusableExecutor(
    'default',
    machine,
  );

  const reusableBase = dockerBase.toReusable('base');

  reusableMachine.defineParameter('version', 'string');
  myConfig.addReusableExecutor(reusableMachine);
  reusableBase.defineParameter('tag', 'string', 'latest', undefined);
  myConfig.addReusableExecutor(reusableBase);

  it('Should validate reusable machine image', () => {
    expect(
      ConfigParser.Validator.validateGenerable(
        CircleCI.mapping.GenerableType.REUSED_EXECUTOR,
        {
          executor: {
            name: 'default',
            version: '1.2.1',
          },
        },
      ),
    ).toEqual(true);
  });
  // TODO (this was previously commented out, before the migration)
  // it('Should not validate with undefined parameter', () => {
  //   expect(
  //     CircleCI.Validator.validateGenerable(CircleCI.mapping.GenerableType.REUSABLE_EXECUTOR, {
  //       executor: {
  //         name: 'default',
  //       },
  //     }),
  //   ).not.toEqual(true);
  // });
});

describe('', () => {
  const myConfig = new CircleCI.Config();

  const machine = new CircleCI.executors.MachineExecutor('large');
  const dockerBase = new CircleCI.executors.DockerExecutor(
    'cimg/base:<< parameters.tag >>',
  );
  const reusableMachine = new CircleCI.reusable.ReusableExecutor(
    'default',
    machine,
  );

  const reusableBase = dockerBase.toReusable('base');

  reusableMachine.defineParameter('version', 'string');
  myConfig.addReusableExecutor(reusableMachine);
  reusableBase.defineParameter('tag', 'string', 'latest', undefined);
  myConfig.addReusableExecutor(reusableBase);
  const reusedBase = new CircleCI.reusable.ReusedExecutor(reusableBase);

  it('Should validate reusable base image shapeless', () => {
    expect(
      ConfigParser.Validator.validateGenerable(
        CircleCI.mapping.GenerableType.REUSED_EXECUTOR,
        reusedBase.generate(),
      ),
    ).toEqual(true);
  });

  it('Should validate reusable base image', () => {
    expect(
      ConfigParser.Validator.validateGenerable(
        CircleCI.mapping.GenerableType.REUSED_EXECUTOR,
        {
          executor: {
            name: 'base',
          },
        },
      ),
    ).toEqual(true);
  });
});
// TODO: Add strict parsing tests
// it('Should not shapeless with required parameter', () => {
//   expect(
//     CircleCI.Validator.validateGenerable(CircleCI.mapping.GenerableType.REUSABLE_EXECUTOR, {
//       executor: 'default',
//     }),
//   ).not.toEqual(true);
// });

// it('Should not validate with improper parameter', () => {
//   expect(
//     CircleCI.Validator.validateGenerable(CircleCI.mapping.GenerableType.REUSABLE_EXECUTOR, {
//       executor: {
//         name: 'default',
//         version: 1.0,
//       },
//     }),
//   ).not.toEqual(true);
// });

// it('Should not validate with undefined reusable executor', () => {
//   expect(
//     CircleCI.Validator.validateGenerable(CircleCI.mapping.GenerableType.REUSABLE_EXECUTOR, {
//       executor: {
//         name: 'undefined',
//       },
//     }),
//   ).not.toEqual(true);
// });
