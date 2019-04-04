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