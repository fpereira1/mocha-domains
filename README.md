# mocha domains

<!-- [![NPM version][npm-image]][npm-url] -->
<!-- [![NPM downloads][downloads-image]][downloads-url] -->
<!-- [![Build status][travis-image]][travis-url] -->
<!-- [![Test coverage][coveralls-image]][coveralls-url] -->

Enable support for domains in Mocha tests.

## Installation

```
npm install mocha-domains --save-dev
```

## Usage

Just require the module in your tests and start writing domains in your tests.

### Node

Install the module using `npm install mocha-domains --save-dev`. Now just require the module to automatically monkey patch any available `mocha` instances. With `mocha`, you have multiple ways of requiring the module - add `--require mocha-domains` to your `mocha.opts` or add `require('mocha-domains')` inside your main test file.

If you need to monkey patch a different mocha instance you can use the library directly:

```js
var mocha = require('mocha')
var mochaDomains = require('mocha-domains')

mochaDomains(mocha)
```

## How It Works

The module monkey patches the `Runnable.prototype.run` method of `mocha` to
enable domains. In contrast to other npm packages, `mocha-domains` extends
`mocha` at runtime - allowing you to use any compatible mocha version.

<!-- [npm-image]: https://img.shields.io/npm/v/mocha-domains.svg?style=flat -->
<!-- [npm-url]: https://npmjs.org/package/mocha-domains -->
<!-- [downloads-image]: https://img.shields.io/npm/dm/mocha-domains.svg?style=flat -->
<!-- [downloads-url]: https://npmjs.org/package/mocha-domains -->
<!-- [travis-image]: https://img.shields.io/travis/blakeembrey/mocha-domains.svg?style=flat -->
<!-- [travis-url]: https://travis-ci.org/blakeembrey/mocha-domains -->
<!-- [coveralls-image]: https://img.shields.io/coveralls/blakeembrey/mocha-domains.svg?style=flat -->
<!-- [coveralls-url]: https://coveralls.io/r/blakeembrey/mocha-domains?branch=master -->
