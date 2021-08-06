[![CircleCI Build Status](https://circleci.com/gh/CircleCI-Public/circleci-config-sdk-ts.svg?style=shield 'CircleCI Build Status')](https://circleci.com/gh/CircleCI-Public/circleci-config-sdk-ts)
[![codecov](https://codecov.io/gh/CircleCI-Public/circleci-config-sdk-ts/branch/main/graph/badge.svg?token=Z4C4RXABS7)](https://codecov.io/gh/CircleCI-Public/circleci-config-sdk-ts)
[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/circleci-public/circleci-config-sdk-ts/blob/main/LICENSE)

# CircleCI Config SDK (TypeScript)

Create and manage your CircleCI config with JavaScript and TypeScript.

[View the SDK Docs](https://furry-adventure-3f2b45c4.pages.github.io/modules.html)

## Installation

Using npm:

```shell
$ npm i --save @circleci/circleci-config-sdk
```

In Node.js:

```typescript
import CircleCI from '@circleci/circleci-config-sdk';
```

In Browser:

```javascript
var CircleCI = require('@circleci/circleci-config-sdk');
```

## Example

Generate a CircleCI config using TypeScript/Javascript, properly typed for full
IntelliSense support.

```typescript
// Instantiate new Config
const myConfig = new CircleCI.Config();
// Create new Workflow
const myWorkflow = new CircleCI.Workflow('myWorkflow');
myConfig.addWorkflow(myWorkflow);

// Create an executor. Reusable.
const nodeExecutor = new CircleCI.Executor.DockerExecutor(
  'node-executor',
  'cimg/node:lts',
);
myConfig.addExecutor(nodeExecutor);

// Create Job
const nodeTestJob = new CircleCI.Job('node-test', nodeExecutor);
myConfig.addJob(nodeTestJob);

// Add steps to job
nodeTestJob
  .addStep(
    new CircleCI.Command.Run({
      command: 'npm install',
      name: 'NPM Install',
    }),
  )
  .addStep(
    new CircleCI.Command.Run({
      command: 'npm run test',
      name: 'Run tests',
    }),
  );

// Add Jobs to Workflow
myWorkflow.addJob(nodeTestJob);

// The `stringify()` function on `CircleCI.Config` will return the CircleCI YAML equivalent.
const MyYamlConfig = myConfig.stringify();
```

`MyYamlConfig` will hold the following string (A valid CircleCI Config).

```yaml
version: 2.1
executors:
  node-executor:
    docker:
      - image: cimg/node:lts
jobs:
  node-test:
    executor:
      name: node-executor
    steps:
      - run:
          command: npm install
          name: NPM Install
      - run:
          command: npm run test
          name: Run tests
workflows:
  myWorkflow:
    jobs:
      - node-test: {}
```
