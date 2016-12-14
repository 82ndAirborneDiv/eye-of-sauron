# Eye of Sauron

## Bootstrap Branch

> Featuring Bootstrap 4 and ng-bootstrap, Webpack 2 (and Webpack DLL plugin for faster dev builds), HMR (Hot Module Replacement), and @ngrx for state management.

###### You can use npm, but it's recommended to use yarn as it installs a lot faster and has other benefits https://yarnpkg.com/ . Make sure you are using yarn version 0.16.0 or newer (check with 'yarn --version')

```bash
git clone https://github.com/informaticslab/eye-of-sauron.git
cd eye-of-sauron
yarn
yarn start
```

## Tooling Features

* Angular 2
  * Async loading
  * Treeshaking
* Webpack 2
  * Webpack Dlls (Speeds up devServer builds)
* HMR (Hot Module Replacement)
* TypeScript 2
  * @types
* Bootstrap 4 and @ng-bootstrap
* @ngrx
  * store (RxJS powered state management for Angular2 apps, inspired by Redux)
  * effects (Side effect model for @ngrx/store)
  * router-store (Bindings to connect angular/router to ngrx/store)
  * store-devtools (Developer Tools for @ngrx/store)
  * store-log-monitor (Log Monitor for @ngrx/store-devtools and Angular 2)
  * ngrx-store-logger (Advanced console logging for @ngrx/store applications, ported from redux-logger.)
  * ngrx-store-freeze in dev mode (@ngrx/store meta reducer that prevents state from being mutated.)
* Karma/Jasmine testing
* Protractor for E2E testing

## Project Goals

## Basic scripts

Use `yarn start` for dev server. Default dev port is `3000`.

Use `yarn run start:hmr` to run dev server in HMR mode.

Use `yarn run build` for production build.

Use `yarn run server:prod` for production server and production watch. Default production port is `8088`.

Default ports and option to use proxy backend for dev server can be changed in `constants.js` file.

### Store Log Monitor / Store Logger

In development mode, the store log monitor appears on the right hand of your screen. This allows
you to view your stored state and manipulate your state history. By default, the monitor is NOT imported
when you are in production mode. State history is also not saved in production mode.

There is also an option to use store-logger which outputs to the console instead of your application view.
To set your development mode store logging preference, go to the constant.js file and edit the `STORE_DEV_TOOLS` constant.
Available options are `monitor | logger | both | none`

### HMR (Hot Module Replacement)

HMR mode allows you to update a particular module without reloading the entire application.
The current state of your app is also stored in @ngrx/store allowing you to make updates to your
code without losing your currently stored state.

### Testing

For unit tests, use `yarn run test` for continuous testing in watch mode and use
`yarn run test:once` for single test. To view code coverage after running test, open `coverage/html/index.html` in your browser.

For e2e tests, use `yarn run e2e`. To run unit test and e2e test at the same time, use `yarn run ci`.

### Credit

This project was built using the follwing [Angular 2 Starter](https://github.com/qdouble/angular-webpack2-starter).

### License

[MIT](https://github.com/qdouble/angular-webpack2-starter/blob/bootstrap/LICENSE)
