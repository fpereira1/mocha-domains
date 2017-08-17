var co = require('co')
var path = require('path')
var isGenFn = require('is-generator').fn
var domain = require('domain');

function protect(fn) {
  return function (done) {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var d = domain.create();
    d.on('error', function (err) {
      d.on('error', function () {});
      var callback = args.pop();
      callback(err);
    });
    d.run.apply(d, [fn].concat(args));
  };
}

/**
 * Export `co-mocha`.
 */
module.exports = coMocha

/**
 * Monkey patch the mocha instance with generator support.
 *
 * @param {Function} mocha
 */
function coMocha (mocha) {
  // Avoid loading `co-mocha` twice.
  if (!mocha || mocha._coMochaIsLoaded) {
    return
  }

  var Runnable = mocha.Runnable
  var run = Runnable.prototype.run

  /**
   * Override the Mocha function runner and enable generator support with co.
   *
   * @param {Function} fn
   */
  Runnable.prototype.run = function (fn) {
    var oldFn = this.fn

    if (isGenFn(oldFn)) {
      this.fn = co.wrap(oldFn)

      // Replace `toString` to output the original function contents.
      this.fn.toString = function () {
        // https://github.com/mochajs/mocha/blob/7493bca76662318183e55294e906a4107433e20e/lib/utils.js#L251
        return Function.prototype.toString.call(oldFn)
          .replace(/^function *\* *\(.*\)\s*{/, 'function () {')
      }
    } else if (isDone(oldFn)) {
      this.fn = protect(oldFn);
    }

    return run.call(this, fn)
  }

  mocha._coMochaIsLoaded = true
}

/**
 * Find active node mocha instances.
 *
 * @return {Array}
 */
function findNodeJSMocha () {
  var suffix = path.sep + path.join('', 'mocha', 'index.js')
  var children = require.cache || {}

  return Object.keys(children)
    .filter(function (child) {
      var val = children[child].exports
      return typeof val === 'function' && val.name === 'Mocha'
    })
    .map(function (child) {
      return children[child].exports
    })
}

function isDone(fn) {
  var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
  var ARGUMENT_NAMES = /([^\s,]+)/g;
  function getParamNames(func) {
    var fnStr = func.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if(result === null)
      result = [];
    return result;
  }
  var args = getParamNames(fn);
  console.log({args});
  return args.indexOf('done') > -1 && args.length === 1;
}

// Attempt to automatically monkey patch available mocha instances.
var modules = typeof window === 'undefined' ? findNodeJSMocha() : [window.Mocha]

modules.forEach(coMocha)
