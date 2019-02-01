# Releasing

Most of the manual steps for releasing this library are (hopefully) abstracted away by
leveraging `np` to automatically update `package.json` and generate an updated changelist
based on commits since the last active tag.

### Release Pre-Requisites:

1. Enable [two-factor authentication for your NPM account](https://docs.npmjs.com/configuring-two-factor-authentication).
2. Ensure you are part of the 'Administration' Group for the NPM `@ampproject` organization.

### Release an Update:

1. Ensure all tests are passing `npm run test`. The release scripts will not proceed
   if any test fails.
2. Execute in your terminal: `npm run release`.
