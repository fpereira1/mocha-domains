var path = require('path');
var domain = require('domain');

function protect(fn) {
  return function (done) {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var d = domain.create();
    var count = 0;
    d.on('error', function (err) {
      if(count === 0) {
        var callback = args.pop();
        callback(err);
        count++;
      }
    });
    d.run.apply(d, [fn].concat(args));
  };
}

/**
 * Export `mocha-domains`.
 */
module.exports = mochaDomains

/**
 * Monkey patch the mocha instance with domains support.
 *
 * @param {Function} mocha
 */
function mochaDomains (mocha) {
  // Avoid loading `mocha-domains` twice.
  if (!mocha || mocha._mochaDomainsIsLoaded) {
    return
  }

  var Runnable = mocha.Runnable
  var run = Runnable.prototype.run

  /**
   * Override the Mocha function runner and enable domains support
   *
   * @param {Function} fn
   */
  Runnable.prototype.run = function (fn) {
    var oldFn = this.fn

    if (isDone(oldFn)) {
      this.fn = protect(oldFn);
    }

    return run.call(this, fn)
  }

  mocha._mochaDomainsIsLoaded = true
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
  return args.indexOf('done') > -1 && args.length === 1;
}

// Attempt to automatically monkey patch available mocha instances.
var modules = typeof window === 'undefined' ? findNodeJSMocha() : [window.Mocha]

modules.forEach(mochaDomains)
