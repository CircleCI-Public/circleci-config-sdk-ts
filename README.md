# CircleCI Config SDK

[![GitHub](https://img.shields.io/github/license/CircleCI-Public/circleci-config-sdk-ts)](https://github.com/CircleCI-Public/circleci-config-sdk-ts/blob/main/LICENSE)
[![CircleCI](https://img.shields.io/circleci/build/gh/CircleCI-Public/circleci-config-sdk-ts/main?logo=circleci&token=5fcb5715c180e9f7d3a076d95779cd88f75d2093)](https://app.circleci.com/pipelines/github/CircleCI-Public/circleci-config-sdk-ts)
[![npm](https://img.shields.io/npm/v/@circleci/circleci-config-sdk?logo=npm)](https://www.npmjs.com/package/@circleci/circleci-config-sdk)
[![codecov](https://codecov.io/gh/CircleCI-Public/circleci-config-sdk-ts/branch/main/graph/badge.svg?token=Z4C4RXABS7)](https://codecov.io/gh/CircleCI-Public/circleci-config-sdk-ts)
[![npm](https://img.shields.io/npm/dm/@circleci/circleci-config-sdk?logo=npm)](https://www.npmjs.com/package/@circleci/circleci-config-sdk)
![GitHub Repo stars](https://img.shields.io/github/stars/CircleCI-Public/circleci-config-sdk-ts?style=social)

Create and manage your [CircleCI](https://circleci.com/) configuration files with JavaScript and
TypeScript.

## Table of Contents

- [CircleCI Config SDK](#circleci-config-sdk)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
    - [Installation](#installation)
      - [Usage](#usage)
    - [Example](#example)
  - [Getting Help](#getting-help)
    - [Resources](#resources)
- [Contributing](#contributing)
- [Related](#related)

## Getting Started

📖 [Getting Started Wiki](https://github.com/CircleCI-Public/circleci-config-sdk-ts/wiki)

📖 [SDK API Docs](https://circleci-public.github.io/circleci-config-sdk-ts/)

💻 [Examples](https://github.com/CircleCI-Public/circleci-config-sdk-ts/tree/main/sample)

---

### Installation

Using npm:

```shell
$ npm i @circleci/circleci-config-sdk
```

Using yarn:

```shell
$ yarn add @circleci/circleci-config-sdk
```

#### Usage

In Browser:

```typescript
import CircleCI from '@circleci/circleci-config-sdk';
```

In Node.js:

```javascript
const CircleCI = require('@circleci/circleci-config-sdk');
```

### Example

Generate a CircleCI config using TypeScript/Javascript, properly typed for full
IntelliSense support.

```typescript
const CircleCI = require('@circleci/circleci-config-sdk');
// Instantiate new Config
const myConfig = new CircleCI.Config();
// Create new Workflow
const myWorkflow = new CircleCI.Workflow('myWorkflow');
myConfig.addWorkflow(myWorkflow);

// Create an executor instance
// Executors are used directly in jobs
// and do not need to be added to the config separately
const nodeExecutor = new CircleCI.executors.DockerExecutor('cimg/node:lts');

// Create Job and add it to the config
const nodeTestJob = new CircleCI.Job('node-test', nodeExecutor);
myConfig.addJob(nodeTestJob);

// Add steps to job
nodeTestJob
  .addStep(new CircleCI.commands.Checkout())
  .addStep(
    new CircleCI.commands.Run({
      command: 'npm install',
      name: 'NPM Install',
    }),
  )
  .addStep(
    new CircleCI.commands.Run({
      command: 'npm run test',
      name: 'Run tests',
    }),
  );

// Add Jobs to Workflow
myWorkflow.addJob(nodeTestJob);

// The `stringify()` function on `CircleCI.Config` will return the CircleCI YAML equivalent.
const MyYamlConfig = myConfig.stringify();

// Save the config to a file in Node.js or the browser. Note, use in the browser requires user interaction.
myConfig.writeFile('config.yml');
```

`MyYamlConfig` will hold the following string (A valid CircleCI Config).

```yaml
version: 2.1
setup: false
jobs:
  node-test:
    docker:
      - image: cimg/node:lts
    resource_class: medium
    steps:
      - checkout: {}
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

## Getting Help

This open-source project utilized GitHub issues and project boards to manage
requests and support.

If you can not find an answer to your question in an existing
[issue](https://github.com/CircleCI-Public/circleci-config-sdk-ts/issues?q=),
you may open a new issue with the appropriate template. Issues are the best way
for the CircleCI team and the open-source community to track and interact with
your questions.

### Resources

Consider checking the following common resources before opening a new issue.

- [CircleCI Config Reference](https://circleci.com/docs/2.0/configuration-reference/)
- [Config SDK API Documentation](https://circleci-public.github.io/circleci-config-sdk-ts/)
- [FAQ](https://github.com/CircleCI-Public/circleci-config-sdk-ts/wiki/FAQ#what-features-of-circleci-config-are-not-supported-by-this-sdk)

# Contributing

This [repository](https://github.com/CircleCI-Public/circleci-config-sdk-ts) welcomes community contributions! See our
[CONTRIBUTING.md](https://github.com/CircleCI-Public/circleci-config-sdk-ts/blob/main/CONTRIBUTING.md)
for guidance on configuring your development environment and how to submit
quality pull requests.

# Related

- [Visual Config Editor](https://github.com/CircleCI-Public/visual-config-editor)
