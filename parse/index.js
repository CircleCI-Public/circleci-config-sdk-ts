/* eslint-disable @typescript-eslint/no-var-requires */
const CircleCI = require('@circleci/circleci-config-sdk');
const fs = require('fs');
const yaml = require('yaml');
const data = fs.readFileSync(0, 'utf-8');

try {
  const validator = CircleCI.Validator.getInstance(true);
  CircleCI.Validator.validateGenerable(
    CircleCI.mapping.GenerableType.CONFIG,
    yaml.parse(data),
    undefined,
    true,
  );
  console.log(JSON.stringify(validator.errors, null, 2));
} catch (e) {
  console.error(e);
}
