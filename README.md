# cvs-vtm-app

This is the angular code for the VTM frontend application.

This is used by the DVSA staff to create and update technical records.

## Getting started

Prerequisites:
* Node 16
* Git Secrets

### Using Make

To get setup on the project you can run: `make init`, `make install` and `make run`.

Then to run tests run:
`make all`

To just run the application run:
`make run`

### Using Node commands

1. Run `npm install`
2. Serve with `npm start`
3. Find more commands with `npm run`

### Backend Requirements

This talks to the following backends:
* cvs-svc-technical-records
* cvs-svc-test-results

# Running storybook

Storybook lets you view components without the rest of the application.

To run storybook:

`npm run storybook`

Then view it on `localhost:6006`.
