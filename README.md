[![CI](https://github.com/dvsa/cvs-app-vtm/actions/workflows/pr-checks.yml/badge.svg)](https://github.com/dvsa/cvs-app-vtm/actions/workflows/pr-checks.yml)

# cvs-vtm-app

This is the angular code for the VTM frontend application.

This is used by the DVSA staff to create and update technical records & test results.

## Getting started

Prerequisites:

- Node 18.18.0 or higher
- NPM 9.8.1 or higher
- Git Secrets

### Using Node commands

1. Run `npm install`
2. Serve with `npm start`
3. Find more commands with `npm run`

### Testing

The test coverage requirement for this project is 80% and automation tests can be found in a java project named `cvs-vtm-auto`

The framework used is Vitest.

To run the test coverage run `npm run test`

Test files share an environment (`isolate: false`) for faster execution.
`test-providers.ts` refreshes each MockStore's state reference to invalidate
downstream selector caches and resets selector overrides on test injector
destruction, but this does not undo mutations to imported state fixtures.
Never mutate exported initial state in tests: copy every nested object being
changed, or use `cloneDeep` for a fresh mutable fixture in `beforeEach`.

### Playwright E2E tests

Playwright runs browser tests separately from the Vitest unit tests. Install the
project dependencies and Chromium, then run the suite:

```sh
npm ci
npx playwright install chromium
cp e2e/creds/app-credential-dummy.json e2e/creds/app-credential.json
```

Populate the ignored `e2e/creds/app-credential.json` with the same
`Environment.<environment>.fullAccess` structure used by `vtm-automation`.
Set `userName`, `password`, and optionally `name` for the test account. Never
commit actual credentials or authenticated browser state.

```sh
npm run test:e2e
ENVIRONMENT=integration npm run test:e2e
ENVIRONMENT=develop BASE_URL=http://localhost:4200 npm run test:e2e
```

`ENVIRONMENT` defaults to `develop` and selects both the deployed URL and the
credential entry. Built-in URLs are provided for `develop`, `integration`,
`dev1`, and `dev2`. `BASE_URL` overrides the URL, including for localhost; keep
`ENVIRONMENT` set to the credential environment you want to use. Variables must
be exported or passed with the command; the runner does not load `.env` files.
For localhost, start the app separately with its normal environment
configuration before running the tests. Playwright does not start a server.

The `setup` project visits `/`, follows the Azure redirect, enters the
credentials using `e2e/page-objects/login-page.ts`, and saves the authenticated
session to `e2e/creds/.auth/fullAccess.json`. The single Chromium login test
depends on setup and verifies the saved session opens the home page with the
technical record search link and sign-out control. It does not sign out, so the
session remains reusable by subsequent tests.

On Linux CI, install browser system dependencies with
`npx playwright install --with-deps chromium`.

The CI job requires the repository Actions secret `VTM_APP_CREDENTIALS`, containing
the credential JSON for `develop`. It writes this to the ignored credential
file without printing it. Authentication setup has tracing, screenshots, and
video disabled to avoid recording credentials. Do not upload the credentials
directory or saved browser state.

Use `npm run test:e2e:ui` for Playwright's interactive runner, or
`npm run test:e2e -- --headed` to see the browser. After a run, use
`npx playwright show-report` to open the HTML report. Reports, failure
screenshots, and traces are ignored by Git.

### Backend Requirements

This talks to the following backends:

- cvs-svc-technical-records
- cvs-svc-test-results
- cvs-svc-test-stations
- cvs-svc-test-types

### Running Locally End-2-End

```
cvs-app-vtm
create .env with environment variables required by Azure SSO. These variables will be used to update `environment.deploy.ts` using `setenv.ts` script by npm start script.
```

```
cvs-svc-technical-records
1. npm install
2. npm run tools-setup
3. build & start

Service is running on http://localhost:3005

For viewing the seed test data in the local dynamodb - `npm i -G dynamodb-admin`

DYNAMO_ENDPOINT=http://localhost:8003 npx dynamodb-admin
which exposes a dynamo admin web front-end on http://localhost:8001
```

```
cvs-svc-test-results

```

# Debugging Locally

There is a `Launch Chrome` vscode debug configuration that will run `ng serve` and launch an instance of chrome. Initially you will get `This site can’t be reached`, but this will automatically refresh once the backgraound processes have finished starting up. Break points set within vscode will be hit while using this instance of chrome.

# Atomic Design

This project aims to follow atomic design principles and is structured as follows:

Atoms - atoms make up everything these are the smallest core components e.g. Label

Molecules - molecules are made up of atoms and provide a more complex component e.g. Nav-Bar

Organisms - organisms are made up of molecules are showcase complex ideas/logic e.g. Calendar with Search logic

More information can be found here: https://bradfrost.com/blog/post/atomic-web-design/
