# 03 orb usage TypeScript

This sample project demonstrates how to use the orb in a TypeScript project.

Orb usage in the Config SDK is still currently considered experimental. While you can use orbs, we hope to make the experience better in the future.

## Generated config

Using the sample project here we will expect to see the following config generated:

```yaml
version: 2.1
setup: false
orbs:
  slack: circleci/slack@4.12
jobs:
  example-job:
    docker:
      - image: cimg/node:19.8.1
    resource_class: small
    steps:
      - checkout
      - run:
          command: npm install
      - run:
          command: npm test
      - slack/notify:
          event: pass
          template: basic_success_1
workflows:
  my-workflow:
    jobs:
      - example-job

```