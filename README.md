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
1. `npm run dev`
2.  Open debugging panel and select `Local: Attach to Node` and press **F5**.

This script run in development mode as usuall. It is already configured to allow a debugger to attach to it at any point after running by using `--inspect` in the `dev:start` npm script. However, if it is necessary to debug the server initialization, it will be necessary to change `--inspect` into `--inspect-brk` so that the server does not start execution until a debugger is attached.

## Experiments
- [x] Typescript client and server
- [x] Nodemon-based dev server
- [x] VS Code server debugging
- [x] Prettier configuration
- [ ] Server-side and client-side fetch
- [ ] Url/query parameters
- [ ] Server-side babel compilation
- [ ] Text localization
- [ ] Automatic RTL styles with postcss-rtl