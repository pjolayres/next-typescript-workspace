[![Build Status](https://travis-ci.com/pjolayres/next-typescript-workspace.svg?branch=master)](https://travis-ci.com/pjolayres/next-typescript-workspace)
[![CircleCI](https://circleci.com/gh/pjolayres/next-typescript-workspace.svg?style=svg)](https://circleci.com/gh/pjolayres/next-typescript-workspace)

# Next.js Typescript Workspace

Experiments based on Next.JS framework using TypeScript. Based on Create Next App (See [README.orig.md](https://github.com/pjolayres/next-typescript-workspace/blob/master/README.orig.md) for more details)

Requirements:
- Node 10.14+
- Nodemon (`npm install nodemon -g`)

## Quick Start
```shell
npm run dev
```

This script will transpile the server using tsc and run the server in development mode. Next.js enables Hot Module Reloading by default so that any changes to the client pages and components will automatically update the client browser. Nodemon is used to automatically restart the server when changes to server-side components are updated.

The website will be available through [http://localhost:3000/](http://localhost:3000/).

It is also possible to run the development environment using docker:
```shell
docker-compose up --build
```

## Production build
```shell
npm run build
npm start
```

This script will transpile the server using tsc and build a production bundle of the website.

It is also possible to run the production environment using docker:
```shell
docker-compose -f docker-compose.prod.yml up --build
```
This assumes that the production server already has the output of `npm run build`:
```bash
├── .docker
│   └── *
├── .next
│   └── *
├── .server
│   └── *
├── static
│   └── *
├── docker-compose.prod.yml
├── package.json
├── package-lock.json
└── server.js
```

## VS Code debugging
1. `npm run dev` or `npm run debug`
2.  Open debugging panel and select `Local: Attach to Node` and press **F5**.

The script runs in development mode as usual. `npm run dev` uses `--inspect` which  allows the debugger to be attached after the server has initialized. `npm run debug` uses `--inspect-brk` which pauses server execution until a debugger is attached, allowing debugger to hit breakpoints in the server initialization code.

## Environment variables
| Name | Possible values | Default | Description  |
| --- | --- | --- | --- |
| NODE_ENV | `production`, `development` | none | Sets the optimization requirements of the servers. |
| LOG_LEVEL | `error`, `warn`, `info`, `verbose`, `debug`, `silly` | `error` for file logs and `debug` for console | Sets the logging level of the application. If set, the value is applied for both file and console logs. Console logs are enabled when `NODE_ENV != 'development'`. |
| BASE_URL | URL without trailing slash | http://localhost:3000 | Used during API and UI testing to determine the environment where the test will be executed. |

## Testing

### Unit tests

Files that end exclusively with `.test.ts` or `.test.tsx` are considered unit tests and are executed when `npm run test` or `npm test` is run. React components may be tested along with a validated snapshot in order to determine if there are breaking changes to the component tree. If the changes are expected and must be saved into the repository, it can be done so using `npm run test:snapshot`.

### API tests

Files that end with `.api.test.ts` are considered API or integration tests. Global API tests are mainly located inside **__tests__/api** directory but may also be located elsewhere in the directory tree.

To execute the API tests on a locally running web application on http://localhost:3000, run the folllowing script:
```shell
npm run test:api
```
If the web application is running on a different port or on a remote server, use the following script:

```shell
BASE_URL=http://localhost:8080 npm run test:api
```

Otherwise, use the following script:

```shell
npm run test:api-ci
```

This will run the web application on http://localhost:3000 and execute the API tests on this instance. Once all the tests are finished, the web application will exit with a success or failure code based on the result of the tests. This case is also useful for a continuous integration pipeline.

### UI tests

Files that end with `.ui.test.ts` are considered UI or end-to-end tests. Global UI tests are mainly located inside **__tests__/ui** directory.

It uses testcafe and headless chromium in order to perform the tests. Because of this, any environment that runs the test requires chromium to be installed in the system. This may be changed to chrome or firefox in `package.json` scripts since either one can run headless instances as well.

To execute the UI tests on a locally running web application on http://localhost:3000, run the folllowing script:
```shell
npm run test:ui
```
If the web application is running on a different port or on a remote server, use the following script:

```shell
BASE_URL=http://localhost:8080 npm run test:ui
```

Otherwise, use the following script:

```shell
npm run test:ui-ci
```

This will run the web application on http://localhost:3000 and execute the UI tests on this instance. Once all the tests are finished, the web application will exit with a success or failure code based on the result of the tests. This case is also useful for a continuous integration pipeline.

## Continuous Integration

Any continuous integration workflows will need to run the following scripts

```shell
npm run lint
npm run build
npm run test
npm run test:api-ci
npm run test:ui-ci
```

This will perform the following checks:
1. All code are properly linted and type safety is ensured.
1. A production build is successful
1. All unit tests are finished successfully including snapshot component tests
1. Automated API tests are finished successfully on a production-like environment
1. Automated UI tests are finished successfully using a headless browser

To run all tests in a single script, use:
```shell
npm run test:ci
```

Docker can also be used to execute the tests by running the following script:
```shell
docker-compose -f docker-compose.ci.yml up --build
```

This will ensure that the test execution environment has all the required tools to run properly (node, chromium, etc.).

## Issues
1. Using Next.js `<Link prefetch />` does not work when running through **Jest** and **react-test-renderer**.
1. `next build` fails if UI tests (e.g. `index.ui.test.ts`) are co-located inside the **/pages** directory beside the corresponding page. Unit tests with snapshots are fine though.

## Checklist
- [x] Typescript client and server
- [x] Nodemon-based dev server
- [x] VS Code server debugging
- [x] Prettier configuration
- [x] Localization/internationalization
- [x] Automated Unit testing framework
- [x] Automated API testing framework
- [x] Automated UI testing framework
- [x] Prettier config
- [x] Docker development, test, and production configurations
- [ ] Server-side and client-side fetch
- [ ] Url/query parameters
- [ ] Automatic RTL styles with postcss-rtl
- [ ] SCSS
- [ ] Redux
- [ ] Error pages (404, 500, etc.)