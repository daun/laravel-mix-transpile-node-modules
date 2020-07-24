# Laravel Mix Transpile Node Modules

[![Software License](https://img.shields.io/npm/l/laravel-mix-transpile-node-modules.svg)](LICENSE)
[![Latest Version on NPM](https://img.shields.io/npm/v/laravel-mix-transpile-node-modules.svg)](https://npmjs.com/package/laravel-mix-transpile-node-modules)

[Laravel Mix](https://github.com/JeffreyWay/laravel-mix) extension for Babel-transpiling dependencies inside `node_modules`.

## Installation

```bash
npm install laravel-mix-transpile-node-modules
```

## Usage

Require the extension inside your `webpack.mix.js` and call `transpileNodeModules()`.

```js
const mix = require('laravel-mix')
require('laravel-mix-transpile-node-modules')

mix.js('src/main.js', 'dist')

/**
 * Transpile node_modules in production
 */
if (mix.inProduction()) {
  mix.transpileNodeModules()
}
```

## Options

### Transpile all node modules

This is the default behavior. Same as passing `true`.

```js
mix.transpileNodeModules()
```

### Transpile selected node modules

Pass an array of npm module names to transpile.

```js
mix.transpileNodeModules(['swiper', 'dom7'])
```

### Don't transpile node modules

Same as not calling the extension at all.

```js
mix.transpileNodeModules(false)
```
