/**
 * Created by zengyx on 17/2/21.
 * 错误处理
 */
import TraceKit from './tracekit'
import http from '../store/api/http'
/*eslint-disable*/
// "Script error." is hard coded into browsers for errors that it can't read.
// this is the result of a script being pulled in from an external domain and CORS.
var _globalOptions = {
  ignoreErrors: []
}
_globalOptions.ignoreErrors.push(/^Script error\.?$/);
_globalOptions.ignoreErrors.push(/^Javascript error: Script error\.? on line 0$/);

var _lastCapturedException = null

var collectedExceptions = []
// join regexp rules into one big rule
_globalOptions.ignoreErrors = joinRegExp(_globalOptions.ignoreErrors);
export function vueErrorPlugin (Vue) {
  Vue = Vue || window.Vue
  // quit if Vue isn't on the page
  if (!Vue || !Vue.config) return;

  Vue.config.errorHandler = function VueErrorHandler(error, vm) {
    captureException(error, {
      extra: {
        componentName: formatComponentName(vm),
        propsData: vm.$options.propsData
      }
    })
  }
}

function formatComponentName (vm) {
  if (vm.$root === vm) {
    return 'root instance'
  }
  var name = vm._isVue
    ? vm.$options.name || vm.$options._componentTag
    : vm.name
  return (name ? 'component <' + name + '>' : 'anonymous component') +
    (vm._isVue && vm.$options.__file ? ' at ' + vm.$options.__file  : '')
}

function captureException(ex, options) {
  // If not an Error is passed through, recall as a message instead
  if (!isError(ex)) {
    return captureMessage(ex, objectMerge({
      trimHeadFrames: 1,
      stacktrace: true // if we fall back to captureMessage, default to attempting a new trace
    }, options));
  }

  // Store the raw exception object for potential debugging and introspection
  _lastCapturedException = ex;

  // TraceKit.report will re-raise any exception passed to it,
  // which means you have to wrap it in try/catch. Instead, we
  // can wrap it here and only re-raise if TraceKit.report
  // raises an exception different from the one we asked to
  // report on.
  try {
    var stack = TraceKit.computeStackTrace(ex);
    _handleStackInfo(stack, options);
  } catch(ex1) {
    if(ex !== ex1) {
      throw ex1;
    }
  }

  return;
}

/*
 * Manually send a message to server
 *
 * @param {string} msg A plain message to be captured in Sentry
 * @param {object} options A specific set of options for this message [optional]
 * @return {Raven}
 */
function captureMessage(msg, options) {
  // config() automagically converts ignoreErrors from a list to a RegExp so we need to test for an
  // early call; we'll error on the side of logging anything called before configuration since it's
  // probably something you should see:
  if (!!_globalOptions.ignoreErrors.test && _globalOptions.ignoreErrors.test(msg)) {
    return;
  }

  options = options || {};

  var data = objectMerge({
    message: msg + ''  // Make sure it's actually a string
  }, options);

  if (_globalOptions.stacktrace || (options && options.stacktrace)) {
    var ex;
    // create a stack trace from this point; just trim
    // off extra frames so they don't include this function call (or
    // earlier Raven.js library fn calls)
    try {
      throw new Error(msg);
    } catch (ex1) {
      ex = ex1;
    }

    // null exception name so `Error` isn't prefixed to msg
    ex.name = null;

    options = objectMerge({
      // fingerprint on msg, not stack trace (legacy behavior, could be
      // revisited)
      fingerprint: msg,
      trimHeadFrames: (options.trimHeadFrames || 0) + 1
    }, options);

    var stack = TraceKit.computeStackTrace(ex);
    var frames = _prepareFrames(stack, options);
    data.stacktrace = {
      // Sentry expects frames oldest to newest
      frames: frames.reverse()
    }
  }

  // Fire away!
  // console.error("error=================")
  // console.error(data)
  _send(data)
  return;
}

function _prepareFrames(stackInfo, options) {
  var self = this;
  var frames = [];
  if (stackInfo.stack && stackInfo.stack.length) {
    each(stackInfo.stack, function(i, stack) {
      var frame = _normalizeFrame(stack);
      if (frame) {
        frames.push(frame);
      }
    });

    // e.g. frames captured via captureMessage throw
    if (options && options.trimHeadFrames) {
      for (var j = 0; j < options.trimHeadFrames && j < frames.length; j++) {
        frames[j].in_app = false;
      }
    }
  }
  frames = frames.slice(0, 50);
  return frames;
}

function _normalizeFrame(frame) {
  if (!frame.url) return;

  // normalize the frames data
  var normalized = {
    filename:   frame.url,
    lineno:     frame.line,
    colno:      frame.column,
    'function': frame.func || '?',
    in_app: true
  };

  return normalized;
}
function _handleStackInfo(stackInfo, options) {
  var frames = _prepareFrames(stackInfo, options);

  //this._triggerEvent('handle', {
  //  stackInfo: stackInfo,
  //  options: options
  //});

  _processException(
    stackInfo.name,
    stackInfo.message,
    stackInfo.url,
    stackInfo.lineno,
    frames,
    options
  );
}
function _processException(type, message, fileurl, lineno, frames, options) {
  var stacktrace;
  if (!!_globalOptions.ignoreErrors.test && _globalOptions.ignoreErrors.test(message)) return;

  message += '';

  if (frames && frames.length) {
    fileurl = frames[0].filename || fileurl;
    // Sentry expects frames oldest to newest
    // and JS sends them as newest to oldest
    frames.reverse();
    stacktrace = {frames: frames};
  } else if (fileurl) {
    stacktrace = {
      frames: [{
        filename: fileurl,
        lineno: lineno,
        in_app: true
      }]
    };
  }

  var data = objectMerge({
    // sentry.interfaces.Exception
    exception: {
      values: [{
        type: type,
        value: message,
        stacktrace: stacktrace
      }]
    },
    culprit: fileurl
  }, options);

  // Fire away!
  // console.error("error=================")
  // console.error(data)
  _send(data)
}

function _send(data) {
  let _navigator = window.navigator
  let _document = window.document
  let _hasNavigator = typeof _navigator !== 'undefined'
  let _hasDocument = typeof _document !== 'undefined'

  let env = {}

  if (_hasNavigator) {
    env.userAgent = _navigator.userAgent
    env.browser = _getBrowserInfo()
    env.os = _getOSInfo()
  }
  if (_hasDocument) {
    if (_document.location && _document.location.href) {
      data.url = _document.location.href
    }
    if (_document.referrer) {
      data.referrer = _document.referrer
    }
  }

  data.env = env

  console.error("error=================", data)

  // 已经报告了的错误不再重复发送
  var errorType = (data.exception && data.exception.values && data.exception.values.length > 0) ? data.exception.values[0].type + ': ' + data.exception.values[0].value : ''
  if (collectedExceptions.indexOf(errorType) === -1) {
    let req = {
      data,
      action: 'app.collect.collectVueErrorInfo'
    }
    http.fetch(req, 'post')
      .then(() => {
        collectedExceptions.push(errorType)
      })
      .catch(err => {})
  }
}

function _getBrowserInfo () {
  let Sys = {};
  let ua = navigator.userAgent.toLowerCase();
  let s;
  (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
  (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
  (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
  (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
  (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
  (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

  if (Sys.ie) return { name: 'IE', version: Sys.ie }
  if (Sys.firefox) return { name: 'Firefox', version: Sys.firefox }
  if (Sys.chrome) return { name: 'Chrome', version: Sys.chrome }
  if (Sys.opera) return { name: 'Opera', version: Sys.opera }
  if (Sys.safari) return { name: 'Safari', version: Sys.safari }

  return { name: '未知', version: '未知' }
}

function _getOSInfo () {
  let userAgent = window.navigator.userAgent
  let isWin = (navigator.platform === 'Win32') || (navigator.platform === 'Windows')
  let isMac = (navigator.platform === 'Mac68K') || (navigator.platform === 'MacPPC') || (navigator.platform === 'Macintosh') || (navigator.platform === 'MacIntel')
  let isLinux = (String(navigator.platform).indexOf('Linux') > -1)
  if (isMac) return 'Mac'
  let isUnix = (navigator.platform === 'X11') && !isWin && !isMac
  if (isUnix) return 'Unix'
  if (isLinux) return 'Linux'
  if (isWin) {
      let winVersion
      winVersion = userAgent.indexOf('Windows NT 5.0') > -1 || userAgent.indexOf('Windows 2000') > -1
      if (winVersion) return 'Windows 2000'
      winVersion = userAgent.indexOf('Windows NT 5.1') > -1 || userAgent.indexOf('Windows XP') > -1
      if (winVersion) return 'Windows XP'
      winVersion = userAgent.indexOf('Windows NT 5.2') > -1 || userAgent.indexOf('Windows 2003') > -1
      if (winVersion) return 'Windows 2003'
      winVersion = userAgent.indexOf('Windows NT 6.0') > -1 || userAgent.indexOf('Windows Vista') > -1
      if (winVersion) return 'Windows Vista'
      winVersion = userAgent.indexOf('Windows NT 6.1') > -1 || userAgent.indexOf('Windows 7') > -1
      if (winVersion) return 'Windows 7'
      winVersion = userAgent.indexOf('Windows NT 6.2') > -1 || userAgent.indexOf('Windows 8') > -1
      if (winVersion) return 'Windows 8'
      winVersion = userAgent.indexOf('Windows NT 6.3') > -1 || userAgent.indexOf('Windows 8.1') > -1
      if (winVersion) return 'Windows 8.1'
      winVersion = userAgent.indexOf('Windows NT 6.4') > -1 || userAgent.indexOf('Windows 10') > -1
      if (winVersion) return 'Windows 10'
      winVersion = userAgent.indexOf('Windows NT 10.0') > -1 || userAgent.indexOf('Windows 10') > -1
      if (winVersion) return 'Windows 10'
  }
  return '未知';
}

//var Object.prototype = Object.prototype;

function isUndefined(what) {
  return what === void 0;
}

function isFunction(what) {
  return typeof what === 'function';
}

function isString(what) {
  return Object.prototype.toString.call(what) === '[object String]';
}

function isObject(what) {
  return typeof what === 'object' && what !== null;
}

function isEmptyObject(what) {
  for (var _ in what) return false;  // eslint-disable-line guard-for-in, no-unused-vars
  return true;
}

// Sorta yanked from https://github.com/joyent/node/blob/aa3b4b4/lib/util.js#L560
// with some tiny modifications
function isError(what) {
  var toString = Object.prototype.toString.call(what);
  return isObject(what) &&
    toString === '[object Error]' ||
    toString === '[object Exception]' || // Firefox NS_ERROR_FAILURE Exceptions
    what instanceof Error;
}

function each(obj, callback) {
  var i, j;

  if (isUndefined(obj.length)) {
    for (i in obj) {
      if (hasKey(obj, i)) {
        callback.call(null, i, obj[i]);
      }
    }
  } else {
    j = obj.length;
    if (j) {
      for (i = 0; i < j; i++) {
        callback.call(null, i, obj[i]);
      }
    }
  }
}

function objectMerge(obj1, obj2) {
  if (!obj2) {
    return obj1;
  }
  each(obj2, function(key, value){
    obj1[key] = value;
  });
  return obj1;
}

function truncate(str, max) {
  return !max || str.length <= max ? str : str.substr(0, max) + '\u2026';
}

/**
 * hasKey, a better form of hasOwnProperty
 * Example: hasKey(MainHostObject, property) === true/false
 *
 * @param {Object} host object to check property
 * @param {string} key to check
 */
function hasKey(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function joinRegExp(patterns) {
  // Combine an array of regular expressions and strings into one large regexp
  // Be mad.
  var sources = [],
    i = 0, len = patterns.length,
    pattern;

  for (; i < len; i++) {
    pattern = patterns[i];
    if (isString(pattern)) {
      // If it's a string, we need to escape it
      // Taken from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
      sources.push(pattern.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1'));
    } else if (pattern && pattern.source) {
      // If it's a regexp already, we want to extract the source
      sources.push(pattern.source);
    }
    // Intentionally skip other cases
  }
  return new RegExp(sources.join('|'), 'i');
}

function urlencode(o) {
  var pairs = [];
  each(o, function(key, value) {
    pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
  });
  return pairs.join('&');
}

// borrowed from https://tools.ietf.org/html/rfc3986#appendix-B
// intentionally using regex and not <a/> href parsing trick because React Native and other
// environments where DOM might not be available
function parseUrl(url) {
  var match = url.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
  if (!match) return {};

  // coerce to undefined values to empty string so we don't get 'undefined'
  var query = match[6] || '';
  var fragment = match[8] || '';
  return {
    protocol: match[2],
    host: match[4],
    path: match[5],
    relative: match[5] + query + fragment // everything minus origin
  };
}
function uuid4() {
  var crypto = _window.crypto || _window.msCrypto;

  if (!isUndefined(crypto) && crypto.getRandomValues) {
    // Use window.crypto API if available
    var arr = new Uint16Array(8);
    crypto.getRandomValues(arr);

    // set 4 in byte 7
    arr[3] = arr[3] & 0xFFF | 0x4000;
    // set 2 most significant bits of byte 9 to '10'
    arr[4] = arr[4] & 0x3FFF | 0x8000;

    var pad = function(num) {
      var v = num.toString(16);
      while (v.length < 4) {
        v = '0' + v;
      }
      return v;
    };

    return pad(arr[0]) + pad(arr[1]) + pad(arr[2]) + pad(arr[3]) + pad(arr[4]) +
      pad(arr[5]) + pad(arr[6]) + pad(arr[7]);
  } else {
    // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0,
        v = c === 'x' ? r : r&0x3|0x8;
      return v.toString(16);
    });
  }
}

/**
 * Given a child DOM element, returns a query-selector statement describing that
 * and its ancestors
 * e.g. [HTMLElement] => body > div > input#foo.btn[name=baz]
 * @param elem
 * @returns {string}
 */
function htmlTreeAsString(elem) {
  /* eslint no-extra-parens:0*/
  var MAX_TRAVERSE_HEIGHT = 5,
    MAX_OUTPUT_LEN = 80,
    out = [],
    height = 0,
    len = 0,
    separator = ' > ',
    sepLength = separator.length,
    nextStr;

  while (elem && height++ < MAX_TRAVERSE_HEIGHT) {

    nextStr = htmlElementAsString(elem);
    // bail out if
    // - nextStr is the 'html' element
    // - the length of the string that would be created exceeds MAX_OUTPUT_LEN
    //   (ignore this limit if we are on the first iteration)
    if (nextStr === 'html' || height > 1 && len + (out.length * sepLength) + nextStr.length >= MAX_OUTPUT_LEN) {
      break;
    }

    out.push(nextStr);

    len += nextStr.length;
    elem = elem.parentNode;
  }

  return out.reverse().join(separator);
}

/**
 * Returns a simple, query-selector representation of a DOM element
 * e.g. [HTMLElement] => input#foo.btn[name=baz]
 * @param HTMLElement
 * @returns {string}
 */
function htmlElementAsString(elem) {
  var out = [],
    className,
    classes,
    key,
    attr,
    i;

  if (!elem || !elem.tagName) {
    return '';
  }

  out.push(elem.tagName.toLowerCase());
  if (elem.id) {
    out.push('#' + elem.id);
  }

  className = elem.className;
  if (className && isString(className)) {
    classes = className.split(/\s+/);
    for (i = 0; i < classes.length; i++) {
      out.push('.' + classes[i]);
    }
  }
  var attrWhitelist = ['type', 'name', 'title', 'alt'];
  for (i = 0; i < attrWhitelist.length; i++) {
    key = attrWhitelist[i];
    attr = elem.getAttribute(key);
    if (attr) {
      out.push('[' + key + '="' + attr + '"]');
    }
  }
  return out.join('');
}

/**
 * Polyfill a method
 * @param obj object e.g. `document`
 * @param name method name present on object e.g. `addEventListener`
 * @param replacement replacement function
 * @param track {optional} record instrumentation to an array
 */
function fill(obj, name, replacement, track) {
  var orig = obj[name];
  obj[name] = replacement(orig);
  if (track) {
    track.push([obj, name, orig]);
  }
}
