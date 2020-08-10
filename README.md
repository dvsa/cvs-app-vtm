# cvs-vtm-app

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

You will need a MS Adal `clientId` and `tenantId` in `environment.ts` file to run the project.
Please rename the `env` file to `.env` as well as adding the relevant `clientId` & `tenantId` values to your environment variables (dotenv):

```
AZURE_CLIENT_ID=
AZURE_TENANT_ID=
API_ENDPOINT_LOCAL=
```


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Debug build

Should you need to log information in the console once developing the `debug` environment variable is accessible from the `src/environments` files and its value is set to `false` when developping locally (`npm run start`) by default.
`debug` environment variable is then accessible by importing `environment` within the application.


```
import { environment } from '@environments/environment';

// environments then returns your configuration object.
console.log(environment);
/** 
* {
*   debug: false
*   name: 'local'
*   production: false
*   ...
* }
**/
```

Further information about [angular configuration](https://angular.io/guide/build).


## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Contributing to the repository

We use [commitlint](https://github.com/conventional-changelog/commitlint) to create standardised commit messages that will be used for automated releases.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
