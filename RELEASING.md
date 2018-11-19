# Releasing

Most of the manual steps for releasing this library are (hopefully) abstracted away by
leveraging `github-release-notes` to automatically generate an updated `CHANGELOG.md`
based on commits since the last active tag.

### Release Pre-Requisites:

1. Follow the [directions](https://github.com/github-tools/github-release-notes#setup)
   to setup a `Github token` for release scripts to leverage.
2. Enable [two-factor authentication for your NPM account](https://docs.npmjs.com/configuring-two-factor-authentication).
3. Ensure you are part of the 'Administration' Group for the NPM `@ampproject` organization.

### Release an Update:

1. Ensure all tests are passing `npm run test`. The release scripts will not proceed
   if any test fails.
2. Bump the [semantic version](https://semver.org/) in `package.json`.
3. Execute in your terminal: `npm run release`.
