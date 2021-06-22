# Contributing

Thank you for considering to contribute to the CircleCI Config SDK! Before you
get started, we recommend taking a look at the guidelines belowL

- [Have a Question?](#question)
- [Issues and Bugs](#issue)
- [Feature Requests](#feature)
- [Contributing](#contribute)
  - [Submission Guidelines](#guidelines)
  - [Release Process](#release)

## <a name="question"></a>Have a Question?

Have a question about the CircleCI or the Config SDK?

- **I have a general question about CircleCI or CircleCI's `config.yml` file.**

  Contact CircleCI's general support by filing a ticket here:
  [Submit a request](https://support.circleci.com/hc/en-us/requests/new)

- **I have a question about JavaScript or best practices**

  Share your question with
  [CircleCI's community Discuss forum](https://discuss.circleci.com/).

## <a name="issue"></a>Discover a Bug?

Find an issue or bug?

You can help us resolve the issue by
[submitting an issue](https://github.com/CircleCI-Public/circleci-config-sdk-ts/issues)
on our GitHub repository.

Up for a challenge? If you think you can fix the issue, consider sending in a
[Pull Request](#pull).

## <a name="feature"></a>Missing Feature?

Is anything missing?

You can request a new feature by
[submitting an issue](https://github.com/CircleCI-Public/circleci-config-sdk-ts/issues)
to our GitHub repository, utilizing the `Feature Request` template.

If you would like to instead contribute a pull request, please follow the
[Submission Guidelines](#guidelines)

## <a name="contribute"></a>Contributing

Thank you for contributing to the CircleCI Config SDK!

Before submitting any new Issue or Pull Request, search our repository for any
existing or previous related submissions.

- [Search Pull Requests](https://github.com/CircleCI-Public/circleci-config-sdk-ts/pulls?q=)
- [Search Issues](https://github.com/CircleCI-Public/circleci-config-sdk-ts/issues?q=)

### <a name="guidelines"></a>Submission Guidelines

#### <a name="commit"></a>Commit Conventions

This project strictly adheres to the
[conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)
specification for creating human readable commit messages with appropriate
automation capabilities, such as changelog generation.

##### Commit Message Format

Each commit message consists of a header, a body and a footer. The header has a
special format that includes a type, a scope and a subject:

```
<type>(optional <scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

Footer should contain a
[closing reference to an issue](https://help.github.com/articles/closing-issues-via-commit-messages/)
if any.

##### Breaking Change

Append a `!` to the end of the `type` in your commit message to suggest a
`BREAKING CHANGE`

```
<type>!(optional <scope>): <subject>
```

##### Type

Must be one of the following:

- **build**: Changes that affect the build system or external dependencies
  (example scopes: npm, eslint, prettier)
- **ci**: Changes to our CircleCI configuration
- **chore**: No production code changes. Updates to readmes and meta documents
- **docs**: Changes to the automated documentation or TSDoc comments
- **feat**: A new feature
- **fix**: A bug fix
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **style**: Changes that do not affect the meaning of the code (white-space,
  formatting, missing semi-colons, etc)
- **test**: Adding missing tests or correcting existing tests
- **sample**: A change to the samples

##### Scope

Scopes should be limited to the following list:

- _**ClassName**_: The name of the TS class being modified or tested
- **sample/#**: The number of the sample added or modified
- **pkg**: Anything related to modifying the package.json

#### <a name="pull"></a>Submitting a Pull Request

After searching for potentially existing pull requests or issues in progress, if
none are found, please open a new issue describing your intended changes and
stating your intention to work on the issue.

Creating issues helps us plan our next release and prevents folks from
duplicating work.

After the issue has been created, follow these steps to create a Pull Request.

1. Fork the
   [CircleCI-Public/circleci-config-sdk-ts](https://github.com/CircleCI-Public/circleci-config-sdk-ts)
   repo.
1. Clone your newly forked repository to your local machine.
1. Create a new branch for your changes: `git checkout -b fix_my_issue main`
1. Implement your change with appropriate test coverage.
1. Utilize our [commit message conventions](commit).
1. Run tests, linters, and formatters locally:
   - `npm run test`
   - `npm run prettier`
   - `npm run lint`
1. Push all changes back to GitHub `git push origin fix_my_issue`
1. In GitHub, send a Pull Request to `circleci-config-sdk-ts:main`

Thank you for your contribution!

##### After Your PR Has Been Merged

After your pull request is merged, you can safely delete your branch and pull
the changes from the main (upstream) repository:

- Delete the remote branch on GitHub either through the GitHub web UI or your
  local shell as follows:

  ```shell
  git push origin --delete fix_my_issue
  ```

- Check out the main branch:

  ```shell
  git checkout main -f
  ```

- Delete the local branch:

  ```shell
  git branch -D fix_my_issue
  ```

- Update your main with the latest upstream version:

  ```shell
  git pull --ff upstream main
  ```

#### <a name="release"></a>How To Issue a Release

_For maintainers only_

_This is subject to change_

This project is managed using
[GitHub Project Boards](https://github.com/CircleCI-Public/circleci-config-sdk-ts/projects)
and is released on NPM automatically after manually creating a GitHub tag and
release.

When it is time to release a new version of this package, follow the following
steps.

1. Ensure all relevant PRs have been merged into the `main` branch, awaiting
   "deployment".
2. Review the commit history to determine the release type (major, minor, patch)
3. Update the `package.json` file with the new version tag.
4. On GitHub,
   [create a new Release](https://github.com/CircleCI-Public/circleci-config-sdk-ts/releases/new)
   with the `main` branch as the target and specify the version number.
5. Include the commit bodies from `git log` for the included commits.
