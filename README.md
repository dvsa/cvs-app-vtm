# cvs-vtm-app

This is the angular code for the VTM frontend application.

This is used by the DVSA staff to create and update technical records & test results.

## Getting started

Prerequisites:

- Node 16
- Git Secrets

### Using Make

To get setup on the project you can run: `make init`, `make install` and `make run`.

Then to run tests run:
`make all`

To just run the application run:
`make run`

To run the mock api run:
`make api`

To get different responses use custom VINs/IDs. Also see `mock-api/mock-api-server.ts` for more details about custom endpoints.

| Argument           | Tech Record API | Test Record API |
| ------------------ | --------------- | --------------- |
| `.*`               | 200             | 200             |
| `notfound`         | 400             | 400             |
| `servererror`      | 500             | 500             |
| `delayok`          | 200             | -               |
| `delayservererror` | 500             | -               |
| `HGV`              | 200             | -               |
| `TRL`              | 200             | -               |

### Using Node commands

1. Run `npm install`
2. Serve with `npm start`
3. Find more commands with `npm run`

### Testing

The test coverage requirement for this project is 80% and automation tests can be found in a java project named `cvs-vtm-auto`

The framework used is Jest.

To run the test coverage run `npm run test`

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

Service is running on listening on http://localhost:3005

For viewing the seed test data in the local dynamodb - `npm i -G dynamodb-admin`

DYNAMO_ENDPOINT=http://localhost:8003 npx dynamodb-admin
which exposes a dynamo admin web front-end on http://localhost:8001
```

```
cvs-svc-test-results

```

# Running storybook

Storybook lets you view components without the rest of the application.

To run storybook:

`npm run storybook`

Then view it on `localhost:6006`.

# Atomic Design

This project aims to follow atomic design principles and is structured as follows:

Atoms - atoms make up everything these are the smallest core components e.g. Label

Molecules - molecules are made up of atoms and provide a more complex component e.g. Nav-Bar

Organisms - organisms are made up of molecules are showcase complex ideas/logic e.g. Calendar with Search logic

More information can be found here: https://bradfrost.com/blog/post/atomic-web-design/
