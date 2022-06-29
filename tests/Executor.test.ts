import * as YAML from 'yaml';
import * as CircleCI from '../src/index';

describe('Instantiate Docker Executor', () => {
  const docker = new CircleCI.executors.DockerExecutor('cimg/node:lts');
  const expectedShape = {
    docker: [{ image: 'cimg/node:lts' }],
    resource_class: 'medium',
  };

  it('Should validate', () => {
    expect(
      CircleCI.Validator.validateGenerable(
        CircleCI.mapping.GenerableType.DOCKER_EXECUTOR,
        expectedShape,
      ),
    ).toEqual(true);
  });

  it('Should parse', () => {
    expect(CircleCI.parsers.parseExecutor(expectedShape)).toEqual(docker);
  });

  it('Should match the expected output', () => {
    expect(docker.generate()).toEqual(expectedShape);
  });

  it('Docker executor should be instance of an Executor', () => {
    expect(docker instanceof CircleCI.executors.Executor).toBeTruthy();
  });

  const reusableExecutor = new CircleCI.reusable.ReusableExecutor(
    'default',
    docker,
  );

  it('Add executor to config and validate', () => {
    const myConfig = new CircleCI.Config();
    myConfig.addReusableExecutor(reusableExecutor);
    expect(myConfig.executors?.length).toBeGreaterThan(0);
  });

  it('Should generate without parameters', () => {
    expect(reusableExecutor.generate()).toEqual({
      default: {
        docker: [{ image: 'cimg/node:lts' }],
        resource_class: 'medium',
      },
    });
  });

  it('Should have the correct static properties for persist', () => {
    expect(docker.generableType).toBe(
      CircleCI.mapping.GenerableType.DOCKER_EXECUTOR,
    );
  });
});

describe('Instantiate Machine Executor', () => {
  const machine = new CircleCI.executors.MachineExecutor();
  const expectedShape = {
    machine: { image: 'ubuntu-2004:202010-01' },
    resource_class: 'medium',
  };

  it('Should validate', () => {
    expect(
      CircleCI.Validator.validateGenerable(
        CircleCI.mapping.GenerableType.MACHINE_EXECUTOR,
        expectedShape,
      ),
    ).toEqual(true);
  });

  it('Should parse', () => {
    expect(CircleCI.parsers.parseExecutor(expectedShape)).toEqual(machine);
  });

  it('Should match the expected output', () => {
    expect(machine.generate()).toEqual(expectedShape);
  });

  it('Add executor to config and validate', () => {
    const myConfig = new CircleCI.Config();
    myConfig.addReusableExecutor(
      new CircleCI.reusable.ReusableExecutor('default', machine),
    );
    expect(myConfig.executors?.length).toBeGreaterThan(0);
  });

  it('Should have the correct static properties for persist', () => {
    expect(machine.generableType).toBe(
      CircleCI.mapping.GenerableType.MACHINE_EXECUTOR,
    );
  });
});

describe('Instantiate MacOS Executor', () => {
  const macos = new CircleCI.executors.MacOSExecutor('13.0.0');
  const expectedShape = {
    macos: {
      xcode: '13.0.0',
    },
    resource_class: 'medium',
  };

  it('Should validate', () => {
    expect(
      CircleCI.Validator.validateGenerable(
        CircleCI.mapping.GenerableType.MACOS_EXECUTOR,
        expectedShape,
      ),
    ).toEqual(true);
  });

  it('Should parse', () => {
    expect(CircleCI.parsers.parseExecutor(expectedShape)).toEqual(macos);
  });

  it('Should match the expected output', () => {
    expect(macos.generate()).toEqual(expectedShape);
  });

  it('Add executor to config and validate', () => {
    const myConfig = new CircleCI.Config();
    myConfig.addReusableExecutor(
      new CircleCI.reusable.ReusableExecutor('default', macos),
    );
    expect(myConfig.executors?.length).toBeGreaterThan(0);
  });

  it('Should have the correct static properties for persist', () => {
    expect(macos.generableType).toBe(
      CircleCI.mapping.GenerableType.MACOS_EXECUTOR,
    );
  });
});

describe('Instantiate Large MacOS Executor', () => {
  const macos = new CircleCI.executors.MacOSExecutor('13.0.0', 'large');
  const expectedShape = {
    macos: {
      xcode: '13.0.0',
    },
    resource_class: 'large',
  };

  it('Should validate', () => {
    expect(
      CircleCI.Validator.validateGenerable(
        CircleCI.mapping.GenerableType.MACOS_EXECUTOR,
        expectedShape,
      ),
    ).toEqual(true);
  });

  it('Should parse', () => {
    expect(CircleCI.parsers.parseExecutor(expectedShape)).toEqual(macos);
  });

  it('Should match the expected output', () => {
    expect(macos.generate()).toEqual(expectedShape);
  });

  it('Add executor to config and validate', () => {
    const myConfig = new CircleCI.Config();
    myConfig.addReusableExecutor(
      new CircleCI.reusable.ReusableExecutor('default', macos),
    );
    expect(myConfig.executors?.length).toBeGreaterThan(0);
  });
});

/**
  This test is an edge case where the shell parameter is manually removed from the executor
  Parsing is not applicable to this test
*/
describe('Instantiate Windows Executor and remove shell', () => {
  const windows = new CircleCI.executors.WindowsExecutor();

  delete windows.parameters?.shell;

  const expectedShape = {
    machine: {
      image: 'windows-server-2019-vs2019:stable',
    },
    resource_class: 'windows.medium',
  };

  it('Should validate', () => {
    expect(
      CircleCI.Validator.validateGenerable(
        CircleCI.mapping.GenerableType.WINDOWS_EXECUTOR,
        expectedShape,
      ),
    ).toEqual(true);
  });

  it('Should match the expected output', () => {
    expect(windows.generate()).toEqual(expectedShape);
  });

  it('Should have the correct static properties for persist', () => {
    expect(windows.generableType).toBe(
      CircleCI.mapping.GenerableType.WINDOWS_EXECUTOR,
    );
  });
});

describe('Instantiate Windows Executor', () => {
  const windows = new CircleCI.executors.WindowsExecutor();
  const expectedShape = {
    machine: {
      image: 'windows-server-2019-vs2019:stable',
    },
    resource_class: 'windows.medium',
    shell: 'powershell.exe -ExecutionPolicy Bypass',
  };

  it('Should validate', () => {
    expect(
      CircleCI.Validator.validateGenerable(
        CircleCI.mapping.GenerableType.WINDOWS_EXECUTOR,
        expectedShape,
      ),
    ).toEqual(true);
  });

  it('Should parse', () => {
    expect(CircleCI.parsers.parseExecutor(expectedShape)).toEqual(windows);
  });

  it('Should match the expected output', () => {
    expect(windows.generate()).toEqual(expectedShape);
  });

  it('Should throw error if fails validation', () => {
    expect(() => {
      CircleCI.parsers.parseExecutor({ not_an_executor: {} });
    }).toThrowError('No executor found.');
  });

  it('Add executor to config and validate', () => {
    const myConfig = new CircleCI.Config();
    myConfig.addReusableExecutor(
      new CircleCI.reusable.ReusableExecutor('default', windows),
    );
    expect(myConfig.executors?.length).toBeGreaterThan(0);
  });
});

describe('Instantiate a 2xlarge Docker Executor', () => {
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
      CircleCI.Validator.validateGenerable(
        CircleCI.mapping.GenerableType.DOCKER_EXECUTOR,
        expectedShape,
      ),
    ).toEqual(true);
  });

  it('Should parse', () => {
    expect(CircleCI.parsers.parseExecutor(expectedShape)).toEqual(xxlDocker);
  });

  it('Should parse', () => {
    expect(() => {
      CircleCI.parsers.parseExecutor({ docker: {} });
    }).toThrowError(`Failed to validate: `);
  });

  it('Should match the expected output', () => {
    expect(xxlDocker.generate()).toEqual(expectedShape);
  });

  it('Add executor to config and validate', () => {
    const myConfig = new CircleCI.Config();
    myConfig.addReusableExecutor(
      new CircleCI.reusable.ReusableExecutor('default', xxlDocker),
    );
    expect(myConfig.executors?.length).toBeGreaterThan(0);
  });
});

describe('Instantiate Large Machine Executor', () => {
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
      CircleCI.Validator.validateGenerable(
        CircleCI.mapping.GenerableType.MACHINE_EXECUTOR,
        expectedShapeLarge,
      ),
    ).toEqual(true);
  });

  it('Should parse the large machine', () => {
    expect(CircleCI.parsers.parseExecutor(expectedShapeLarge)).toEqual(
      machineLarge,
    );
  });

  const machineMedium = new CircleCI.executors.MachineExecutor('medium');
  const expectedShapeMedium = {
    machine: {
      image: 'ubuntu-2004:202010-01',
    },
    resource_class: 'medium',
  };

  it('Should match the expected output', () => {
    expect(machineMedium.generate()).toEqual(expectedShapeMedium);
  });

  it('Should validate the medium machine', () => {
    expect(
      CircleCI.Validator.validateGenerable(
        CircleCI.mapping.GenerableType.MACHINE_EXECUTOR,
        expectedShapeMedium,
      ),
    ).toEqual(true);
  });

  it('Should parse the medium machine', () => {
    expect(CircleCI.parsers.parseExecutor(expectedShapeMedium)).toEqual(
      machineMedium,
    );
  });

  it('Add executors to config and validate', () => {
    const myConfig = new CircleCI.Config();
    myConfig
      .addReusableExecutor(
        new CircleCI.reusable.ReusableExecutor('machine_large', machineLarge),
      )
      .addReusableExecutor(
        new CircleCI.reusable.ReusableExecutor('machine_medium', machineMedium),
      );
    expect(myConfig.executors?.length).toBe(2);
  });
});

describe('Generate a config with a Reusable Executor with parameters', () => {
  const machine = new CircleCI.executors.MachineExecutor('large');
  const reusable = new CircleCI.reusable.ReusableExecutor(
    'default',
    machine,
    new CircleCI.parameters.CustomParametersList(),
  );
  const expectedUsageShape = {
    executor: 'default',
  };

  it('Should match the expected output in job context', () => {
    expect(reusable.reuse().generate(true)).toEqual(expectedUsageShape);
  });

  it('Should throw error during parsing', () => {
    expect(() => {
      CircleCI.parsers.parseExecutor(expectedUsageShape);
    }).toThrowError('Reusable executor default not found in config');
  });

  it('Should match the expected output with no context', () => {
    const expectedShape = {
      default: {
        machine: {
          image: 'ubuntu-2004:202010-01',
        },
        resource_class: 'large',
        parameters: {},
      },
    };
    expect(reusable.generate()).toEqual(expectedShape);
  });

  const config = new CircleCI.Config();

  config.addReusableExecutor(reusable);

  it('Should validate shapeless', () => {
    const expectedShapeless = {
      executor: 'default',
    };

    expect(
      CircleCI.Validator.validateGenerable(
        CircleCI.mapping.GenerableType.REUSED_EXECUTOR,
        expectedShapeless,
      ),
    ).toEqual(true);
  });

  const myConfig = new CircleCI.Config();

  myConfig.addReusableExecutor(reusable);

  const executorsList = {
    default: {
      machine: {
        image: 'ubuntu-2004:202010-01',
      },
      resource_class: 'large',
      parameters: {},
    },
  };

  it('Should produce a config with executors', () => {
    const expectedConfigShape = {
      version: 2.1,
      setup: false,
      executors: executorsList,
      jobs: {},
      workflows: {},
    };
    expect(YAML.parse(myConfig.generate())).toEqual(expectedConfigShape);
  });

  it('Should produce a config with executors', () => {
    expect(CircleCI.parsers.parseReusableExecutors(executorsList)).toEqual(
      myConfig.executors,
    );
  });

  it('Should have the correct static properties for persist', () => {
    expect(reusable.generableType).toBe(
      CircleCI.mapping.GenerableType.REUSABLE_EXECUTOR,
    );
  });
});

describe('Generate a config with a Reusable Executor', () => {
  const myConfig = new CircleCI.Config();

  const machine = new CircleCI.executors.MachineExecutor('large');
  const dockerBase = new CircleCI.executors.DockerExecutor(
    'cimg/base:<< parameters.tag >>',
  );
  const reusableMachine = new CircleCI.reusable.ReusableExecutor(
    'default',
    machine,
  );

  const reusableBase = dockerBase.asReusable('base');

  reusableMachine.defineParameter('version', 'string');
  myConfig.addReusableExecutor(reusableMachine);
  reusableBase.defineParameter('tag', 'string', 'latest', undefined);
  myConfig.addReusableExecutor(reusableBase);

  it('Should validate reusable machine image', () => {
    expect(
      CircleCI.Validator.validateGenerable(
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

  // it('Should not validate with undefined parameter', () => {
  //   expect(
  //     CircleCI.Validator.validateGenerable(CircleCI.mapping.GenerableType.REUSABLE_EXECUTOR, {
  //       executor: {
  //         name: 'default',
  //       },
  //     }),
  //   ).not.toEqual(true);
  // });

  const reusedBase = new CircleCI.reusable.ReusedExecutor(reusableBase);

  it('Should validate reusable base image shapeless', () => {
    expect(
      CircleCI.Validator.validateGenerable(
        CircleCI.mapping.GenerableType.REUSED_EXECUTOR,
        reusedBase.generate(),
      ),
    ).toEqual(true);
  });

  it('Should have correct static properties', () => {
    expect(reusedBase.generableType).toEqual(
      CircleCI.mapping.GenerableType.REUSED_EXECUTOR,
    );
    expect(
      reusedBase.executor instanceof CircleCI.reusable.ReusableExecutor,
    ).toEqual(true);
    expect(reusedBase.parameters === undefined).toEqual(true);
  });

  it('Should have correct static properties', () => {
    expect(reusedBase.generableType).toEqual(
      CircleCI.mapping.GenerableType.REUSED_EXECUTOR,
    );
    expect(
      reusedBase.executor instanceof CircleCI.reusable.ReusableExecutor,
    ).toEqual(true);
    expect(reusedBase.parameters === undefined).toEqual(true);
  });

  it('Should validate reusable base image', () => {
    expect(
      CircleCI.Validator.validateGenerable(
        CircleCI.mapping.GenerableType.REUSED_EXECUTOR,
        {
          executor: {
            name: 'base',
          },
        },
      ),
    ).toEqual(true);
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

  it('Should produce a config with executors', () => {
    const expected = {
      version: 2.1,
      setup: false,
      executors: {
        base: {
          docker: [{ image: 'cimg/base:<< parameters.tag >>' }],
          resource_class: 'medium',
          parameters: {
            tag: {
              type: 'string',
              default: 'latest',
            },
          },
        },
        default: {
          machine: {
            image: 'ubuntu-2004:202010-01',
          },
          parameters: {
            version: {
              type: 'string',
            },
          },
          resource_class: 'large',
        },
      },
      jobs: {},
      workflows: {},
    };
    expect(YAML.parse(myConfig.generate())).toEqual(expected);
  });
});
