# mocha domains

[![Greenkeeper badge](https://badges.greenkeeper.io/fpereira1/mocha-domains.svg?token=e560d07e032dc99c2a6c3daca732cf28766fc9f0119367858215f58e35bd278b&ts=1502974385281)](https://greenkeeper.io/)

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

Enable support for generators in Mocha tests using [co](https://github.com/visionmedia/co).

Use the `--harmony-generators` flag when running node 0.11.x to access generator functions, or transpile your tests using [traceur](https://github.com/google/traceur-compiler) or [regenerator](https://github.com/facebook/regenerator).

## Installation

```
npm install mocha-domains --save-dev
```

## Usage

Just require the module in your tests and start writing generators in your tests.

```js
it('should do something', function * () {
  yield users.load(123)
})
```

### Node

Install the module using `npm install mocha-domains --save-dev`. Now just require the module to automatically monkey patch any available `mocha` instances. With `mocha`, you have multiple ways of requiring the module - add `--require mocha-domains` to your `mocha.opts` or add `require('mocha-domains')` inside your main test file.

If you need to monkey patch a different mocha instance you can use the library directly:

```js
var mocha = require('mocha')
var coMocha = require('mocha-domains')

coMocha(mocha)
```

### `<script>` Tag

```html
<script src="mocha-domains.js"></script>
```

Including the browserified script will automatically patch `window.Mocha`. Just make sure you include it after `mocha.js`. If that is not possible the library exposes `window.coMocha`, which can be used (`window.coMocha(window.Mocha)`).

### AMD

Same details as the script, but using AMD requires instead.

## How It Works

The module monkey patches the `Runnable.prototype.run` method of `mocha` to enable generators. In contrast to other npm packages, `mocha-domains` extends `mocha` at runtime - allowing you to use any compatible mocha version.

## License

MIT

[npm-image]: https://img.shields.io/npm/v/mocha-domains.svg?style=flat
[npm-url]: https://npmjs.org/package/mocha-domains
[downloads-image]: https://img.shields.io/npm/dm/mocha-domains.svg?style=flat
[downloads-url]: https://npmjs.org/package/mocha-domains
[travis-image]: https://img.shields.io/travis/blakeembrey/mocha-domains.svg?style=flat
[travis-url]: https://travis-ci.org/blakeembrey/mocha-domains
[coveralls-image]: https://img.shields.io/coveralls/blakeembrey/mocha-domains.svg?style=flat
[coveralls-url]: https://coveralls.io/r/blakeembrey/mocha-domains?branch=master
