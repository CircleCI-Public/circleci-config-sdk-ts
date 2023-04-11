import * as CircleCI from "@circleci/circleci-config-sdk";
// Though reusable config in CircleCI can be replaced with JavaScript in many cases, often we want to take advantage of
// the existing Orbs that are already provided by the community and CircleCI team.

// We will be using the Slack orb
// https://circleci.com/developer/orbs/orb/circleci/slack

// The Slack orb's included command and job happen to share the same parameters.
const SlackParams = new CircleCI.parameters.CustomParametersList([
  new CircleCI.parameters.CustomParameter("branch_pattern", "string"),
  new CircleCI.parameters.CustomParameter("tag_pattern", "string"),
  new CircleCI.parameters.CustomParameter("channel", "string"),
  new CircleCI.parameters.CustomEnumParameter("event", ["fail", "pass", "always"]),
  new CircleCI.parameters.CustomParameter("mentions", "string"),
  new CircleCI.parameters.CustomParameter("custom", "string"),
  new CircleCI.parameters.CustomParameter("template", "string"),
])

// The manifest gives us access to the components provided by the orb and their parameters in TypeScript, with proper type checking.
const SlackOrbManifest: CircleCI.types.orb.OrbImportManifest = {
  commands: {
    notify: SlackParams,
  },
  jobs: {
    "on-hold": SlackParams,
  },
  executors: {},
};

// Export the "imported" orb, which we can then use in our config.
export const SlackOrb = new CircleCI.orb.OrbImport(
  "slack", // The "alias" of the orb, used to reference it in the config
  "circleci", // The namespace of the orb
  "slack", // The name of the orb
  "4.12", // The version of the orb
  "An optional description of the orb",
  SlackOrbManifest // The manifest gives us access to the commands and jobs provided by the orb in TypeScript
);