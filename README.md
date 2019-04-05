# Next.js Typescript Workspace

Experiments based on Next.JS framework using TypeScript. Based on Create Next App (See [README.orig.md](https://github.com/pjolayres/next-typescript-workspace/blob/master/README.orig.md) for more details)

## Quick Start
```shell
npm run dev
```

This script will transpile the server using tsc and run the server in development mode. Next.js enables Hot Module Reloading by default so that any changes to the client pages and components will automatically update the client browser. Nodemon is used to automatically restart the server when changes to server-side components are updated.

The website will be available through [http://localhost:3000/](http://localhost:3000/).

## Production build
```shell
npm run build
npm start
```

This script will transpile the server using tsc and build a production bundle of the website.

## VS Code debugging
1. `npm run dev` or `npm run debug`
2.  Open debugging panel and select `Local: Attach to Node` and press **F5**.

The script runs in development mode as usual. `npm run dev` uses `--inspect` which  allows the debugger to be attached after the server has initialized. `npm run debug` uses `--inspect-brk` which pauses server execution until a debugger is attached, allowing debugger to hit breakpoints in the server initialization code.

## Environment variables
| Name | Possible values | Default | Description  |
| --- | --- | --- | --- |
| NODE_ENV | `production`, `development` | none | Sets the optimization requirements of the servers. |
| LOG_LEVEL | `error`, `warn`, `info`, `verbose`, `debug`, `silly` | `error` for file logs and `debug` for console | Sets the logging level of the application. If set, the value is applied for both file and console logs. Console logs are enabled when `NODE_ENV != 'development'`. |

## Testing

### Unit tests

Files that end exclusively with `.test.ts` or `.test.tsx` are considered unit tests and are executed when `npm run test` or `npm test` is run. React components may be tested along with a validated snapshot in order to determine if there are breaking changes to the component tree. If the changes are expected and must be saved into the repository, it can be done so using `npm run test:snapshot`.

### API tests

Files that end with `.api.test.ts` are considered API or integration tests. These are mainly located inside **__tests__/api** directory.

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

This will run the web application on **http://localhost:3000** and execute the API tests on this instance. Once all the tests are finished, the web application will exit with a success or failure code based on the result of the tests. This case is also useful for continuous integration setup.


## Issues
1. Using Next.js `<Link prefetch />` does not work when running through **Jest** and **react-test-renderer**.

## Checklist
- [x] Typescript client and server
- [x] Nodemon-based dev server
- [x] VS Code server debugging
- [x] Prettier configuration
- [x] Text localization
- [ ] Server-side and client-side fetch
- [ ] Url/query parameters
- [ ] Server-side babel compilation
- [ ] Automatic RTL styles with postcss-rtl