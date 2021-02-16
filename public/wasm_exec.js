
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) ||
    _iterableToArrayLimit(arr, i) ||
    _unsupportedIterableToArray(arr, i) ||
    _nonIterableRest()
  );
}

function _nonIterableRest() {
  throw new TypeError(
    "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
  );
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr)))
    return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;
  try {
    for (
      var _i = arr[Symbol.iterator](), _s;
      !(_n = (_s = _i.next()).done);
      _n = true
    ) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === "function" &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? "symbol"
        : typeof obj;
    };
  }
  return _typeof(obj);
}

(function () {
  if ((console.log("imported"), "undefined" != typeof global));
  else if ("undefined" != typeof window) window.global = window;
  else {
    if ("undefined" == typeof self)
      throw new Error(
        "cannot export Go (neither global, window nor self is defined)"
      );
    self.global = self;
  }
  var e = {
    get: function get(e, t) {
      return t in e && e[t] instanceof Function
        ? function () {
            if (arguments[arguments.length - 1] instanceof Function) {
              var s = arguments[arguments.length - 1];

              arguments[arguments.length - 1] = function () {
                return Reflect.apply(s, arguments.callee, arguments);
              };
            }

            return Reflect.apply(e[t], e, arguments);
          }
        : e[t];
    }
  };
  global.require || "undefined" == typeof require || (global.require = require),
    !global.fs &&
      global.require &&
      "object" == (typeof fs === "undefined" ? "undefined" : _typeof(fs)) &&
      null !== fs &&
      0 !== Object.keys(fs).length &&
      (global.fs = fs);

  var t = function t() {
    var e = new Error("not implemented");
    return (e.code = "ENOSYS"), e;
  };

  if (!global.fs) {
    var _e = "";
    global.fs = {
      constants: {
        O_WRONLY: -1,
        O_RDWR: -1,
        O_CREAT: -1,
        O_TRUNC: -1,
        O_APPEND: -1,
        O_EXCL: -1
      },
      writeSync: function writeSync(t, s) {
        var n = (_e += i.decode(s)).lastIndexOf("\n");

        return (
          -1 != n && (console.log(_e.substr(0, n)), (_e = _e.substr(n + 1))),
          s.length
        );
      },
      write: function write(e, s, i, n, o, l) {
        if (0 !== i || n !== s.length || null !== o) return void l(t());
        l(null, this.writeSync(e, s));
      },
      chmod: function chmod(e, s, i) {
        i(t());
      },
      chown: function chown(e, s, i, n) {
        n(t());
      },
      close: function close(e, s) {
        s(t());
      },
      fchmod: function fchmod(e, s, i) {
        i(t());
      },
      fchown: function fchown(e, s, i, n) {
        n(t());
      },
      fstat: function fstat(e, s) {
        s(t());
      },
      fsync: function fsync(e, t) {
        t(null);
      },
      ftruncate: function ftruncate(e, s, i) {
        i(t());
      },
      lchown: function lchown(e, s, i, n) {
        n(t());
      },
      link: function link(e, s, i) {
        i(t());
      },
      lstat: function lstat(e, s) {
        s(t());
      },
      mkdir: function mkdir(e, s, i) {
        i(t());
      },
      open: function open(e, s, i, n) {
        n(t());
      },
      read: function read(e, s, i, n, o, l) {
        l(t());
      },
      readdir: function readdir(e, s) {
        s(t());
      },
      readlink: function readlink(e, s) {
        s(t());
      },
      rename: function rename(e, s, i) {
        i(t());
      },
      rmdir: function rmdir(e, s) {
        s(t());
      },
      stat: function stat(e, s) {
        s(t());
      },
      symlink: function symlink(e, s, i) {
        i(t());
      },
      truncate: function truncate(e, s, i) {
        i(t());
      },
      unlink: function unlink(e, s) {
        s(t());
      },
      utimes: function utimes(e, s, i, n) {
        n(t());
      }
    };
  }

  if (
    (global.process ||
      (global.process = {
        getuid: function getuid() {
          return -1;
        },
        getgid: function getgid() {
          return -1;
        },
        geteuid: function geteuid() {
          return -1;
        },
        getegid: function getegid() {
          return -1;
        },
        getgroups: function getgroups() {
          throw t();
        },
        pid: -1,
        ppid: -1,
        umask: function umask() {
          throw t();
        },
        cwd: function cwd() {
          throw t();
        },
        chdir: function chdir() {
          throw t();
        }
      }),
    !global.crypto && global.require)
  ) {
    var _e2 = require("crypto");

    global.crypto = {
      getRandomValues: function getRandomValues(t) {
        _e2.randomFillSync(t);
      }
    };
  }

  if (!global.crypto)
    throw new Error(
      "global.crypto is not available, polyfill required (getRandomValues only)"
    );
  if (
    (global.performance ||
      (global.performance = {
        now: function now() {
          var _process$hrtime = process.hrtime(),
            _process$hrtime2 = _slicedToArray(_process$hrtime, 2),
            e = _process$hrtime2[0],
            t = _process$hrtime2[1];

          return 1e3 * e + t / 1e6;
        }
      }),
    !global.TextEncoder &&
      global.require &&
      (global.TextEncoder = require("util").TextEncoder),
    !global.TextEncoder)
  )
    throw new Error("global.TextEncoder is not available, polyfill required");
  if (
    (!global.TextDecoder &&
      global.require &&
      (global.TextDecoder = require("util").TextDecoder),
    !global.TextDecoder)
  )
    throw new Error("global.TextDecoder is not available, polyfill required");

  if (!(global.process && "node" === global.process.title)) {
    global.fs.constants = {
      O_RDONLY: 0,
      O_WRONLY: 1,
      O_RDWR: 2,
      O_CREAT: 64,
      O_CREATE: 64,
      O_EXCL: 128,
      O_NOCTTY: 256,
      O_TRUNC: 512,
      O_APPEND: 1024,
      O_DIRECTORY: 65536,
      O_NOATIME: 262144,
      O_NOFOLLOW: 131072,
      O_SYNC: 1052672,
      O_DIRECT: 16384,
      O_NONBLOCK: 2048
    };
    var _t = "";
    (global.fs.writeSyncOriginal = global.fs.writeSync),
      (global.fs.writeSync = function (e, s) {
        var _global$fs;

        if (1 === e || 2 === e) {
          var _e3 = (_t += i.decode(s)).lastIndexOf("\n");

          return (
            -1 != _e3 &&
              (console.log(_t.substr(0, _e3)), (_t = _t.substr(_e3 + 1))),
            s.length
          );
        }

        return (_global$fs = global.fs).writeSyncOriginal.apply(
          _global$fs,
          arguments
        );
      }),
      (global.fs.writeOriginal = global.fs.write),
      (global.fs.write = function (e, t, s, i, n, o) {
        var _global$fs2;

        if (1 !== e && 2 !== e)
          return (
            (arguments[1] = global.Buffer.from(arguments[1])),
            (_global$fs2 = global.fs).writeOriginal.apply(
              _global$fs2,
              arguments
            )
          );
        if (0 !== s || i !== t.length || null !== n)
          throw new Error("not implemented");
        o(null, this.writeSync(e, t), t);
      }),
      (global.fs.openOriginal = global.fs.open),
      (global.fs.open = function (e, t, s, i) {
        var n = "r",
          o = global.fs.constants;
        if ((console.log("open dir?", e, "flag", t, n), t & o.O_WRONLY))
          (n = "w"), t & o.O_EXCL && (n = "wx");
        else if (t & o.O_RDWR)
          n =
            t & o.O_CREAT && t & o.O_TRUNC
              ? t & o.O_EXCL
                ? "wx+"
                : "w+"
              : "r+";
        else {
          if (t & o.O_APPEND)
            throw (console.log("append error"), new Error("Not implmented"));
          (n = "r+"), console.log("open dir?", e, "flag", t, n);
        }
        return global.fs.openOriginal(e, n, s, i);
      }),
      (global.fs.fstatOriginal = global.fs.fstat),
      (global.fs.fstat = function (e, t) {
        return global.fs.fstatOriginal(e, function () {
          var e = arguments[1];
          return (
            delete e.fileData,
            (e.atimeMs = e.atime.getTime()),
            (e.mtimeMs = e.mtime.getTime()),
            (e.ctimeMs = e.ctime.getTime()),
            (e.birthtimeMs = e.birthtime.getTime()),
            t(arguments[0], e)
          );
        });
      }),
      (global.fs.closeOriginal = global.fs.close),
      (global.fs.close = function (e, t) {
        return global.fs.closeOriginal(e, function () {
          return (
            void 0 === arguments[0] && (arguments[0] = null),
            t.apply(void 0, arguments)
          );
        });
      }),
      (global.fs = new Proxy(global.fs, e));
  }

  var s = new TextEncoder("utf-8"),
    i = new TextDecoder("utf-8");

  if (
    ((global.Go = /*#__PURE__*/ (function () {
      function _class() {
        var _this = this;

        _classCallCheck(this, _class);

        (this.argv = ["js"]),
          (this.env = {}),
          (this.exit = function (e) {
            (_this.exitCode = e), 0 !== e && console.warn("exit code:", e);
          }),
          (this._exitPromise = new Promise(function (e) {
            _this._resolveExitPromise = e;
          })),
          (this._pendingEvent = null),
          (this._scheduledTimeouts = new Map()),
          (this._nextCallbackTimeoutID = 1);

        var e = function e(_e4, t) {
            _this.mem.setUint32(_e4 + 0, t, !0),
              _this.mem.setUint32(_e4 + 4, Math.floor(t / 4294967296), !0);
          },
          t = function t(e) {
            return (
              _this.mem.getUint32(e + 0, !0) +
              4294967296 * _this.mem.getInt32(e + 4, !0)
            );
          },
          n = function n(e) {
            var t = _this.mem.getFloat64(e, !0);

            if (0 === t) return;
            if (!isNaN(t)) return t;

            var s = _this.mem.getUint32(e, !0);

            return _this._values[s];
          },
          o = function o(e, t) {
            if ("number" == typeof t && 0 !== t)
              return isNaN(t)
                ? (_this.mem.setUint32(e + 4, 2146959360, !0),
                  void _this.mem.setUint32(e, 0, !0))
                : void _this.mem.setFloat64(e, t, !0);
            if (void 0 === t) return void _this.mem.setFloat64(e, 0, !0);

            var s = _this._ids.get(t);

            void 0 === s &&
              (void 0 === (s = _this._idPool.pop()) &&
                (s = _this._values.length),
              (_this._values[s] = t),
              (_this._goRefCounts[s] = 0),
              _this._ids.set(t, s)),
              _this._goRefCounts[s]++;
            var i = 0;

            switch (_typeof(t)) {
              case "object":
                null !== t && (i = 1);
                break;

              case "string":
                i = 2;
                break;

              case "symbol":
                i = 3;
                break;

              case "function":
                i = 4;
            }

            _this.mem.setUint32(e + 4, 2146959360 | i, !0),
              _this.mem.setUint32(e, s, !0);
          },
          l = function l(e) {
            var s = t(e + 0),
              i = t(e + 8);
            return new Uint8Array(_this._inst.exports.mem.buffer, s, i);
          },
          r = function r(e) {
            var s = t(e + 0),
              i = t(e + 8),
              o = new Array(i);

            for (var _e5 = 0; _e5 < i; _e5++) {
              o[_e5] = n(s + 8 * _e5);
            }

            return o;
          },
          a = function a(e) {
            var s = t(e + 0),
              n = t(e + 8);
            return i.decode(new DataView(_this._inst.exports.mem.buffer, s, n));
          },
          c = Date.now() - performance.now();

        this.importObject = {
          go: {
            "runtime.wasmExit": function runtimeWasmExit(e) {
              e >>>= 0;

              var t = _this.mem.getInt32(e + 8, !0);

              (_this.exited = !0),
                delete _this._inst,
                delete _this._values,
                delete _this._goRefCounts,
                delete _this._ids,
                delete _this._idPool,
                _this.exit(t);
            },
            "runtime.wasmWrite": function runtimeWasmWrite(e) {
              var s = t((e >>>= 0) + 8),
                i = t(e + 16),
                n = _this.mem.getInt32(e + 24, !0);

              fs.writeSync(
                s,
                new Uint8Array(_this._inst.exports.mem.buffer, i, n)
              );
            },
            "runtime.resetMemoryDataView": function runtimeResetMemoryDataView(
              e
            ) {
              _this.mem = new DataView(_this._inst.exports.mem.buffer);
            },
            "runtime.nanotime1": function runtimeNanotime1(t) {
              e((t >>>= 0) + 8, 1e6 * (c + performance.now()));
            },
            "runtime.walltime1": function runtimeWalltime1(t) {
              t >>>= 0;
              var s = new Date().getTime();
              e(t + 8, s / 1e3),
                _this.mem.setInt32(t + 16, (s % 1e3) * 1e6, !0);
            },
            "runtime.scheduleTimeoutEvent": function runtimeScheduleTimeoutEvent(
              e
            ) {
              e >>>= 0;
              var s = _this._nextCallbackTimeoutID;
              _this._nextCallbackTimeoutID++,
                _this._scheduledTimeouts.set(
                  s,
                  setTimeout(function () {
                    for (_this._resume(); _this._scheduledTimeouts.has(s); ) {
                      console.warn(
                        "scheduleTimeoutEvent: missed timeout event"
                      ),
                        _this._resume();
                    }
                  }, t(e + 8) + 1)
                ),
                _this.mem.setInt32(e + 16, s, !0);
            },
            "runtime.clearTimeoutEvent": function runtimeClearTimeoutEvent(e) {
              e >>>= 0;

              var t = _this.mem.getInt32(e + 8, !0);

              clearTimeout(_this._scheduledTimeouts.get(t)),
                _this._scheduledTimeouts.delete(t);
            },
            "runtime.getRandomData": function runtimeGetRandomData(e) {
              (e >>>= 0), crypto.getRandomValues(l(e + 8));
            },
            "syscall/js.finalizeRef": function syscallJsFinalizeRef(e) {
              e >>>= 0;

              var t = _this.mem.getUint32(e + 8, !0);

              if ((_this._goRefCounts[t]--, 0 === _this._goRefCounts[t])) {
                var _e6 = _this._values[t];
                (_this._values[t] = null),
                  _this._ids.delete(_e6),
                  _this._idPool.push(t);
              }
            },
            "syscall/js.stringVal": function syscallJsStringVal(e) {
              o((e >>>= 0) + 24, a(e + 8));
            },
            "syscall/js.valueGet": function syscallJsValueGet(e) {
              e >>>= 0;
              var t = Reflect.get(n(e + 8), a(e + 16));
              (e = _this._inst.exports.getsp() >>> 0), o(e + 32, t);
            },
            "syscall/js.valueSet": function syscallJsValueSet(e) {
              (e >>>= 0), Reflect.set(n(e + 8), a(e + 16), n(e + 32));
            },
            "syscall/js.valueDelete": function syscallJsValueDelete(e) {
              (e >>>= 0), Reflect.deleteProperty(n(e + 8), a(e + 16));
            },
            "syscall/js.valueIndex": function syscallJsValueIndex(e) {
              o((e >>>= 0) + 24, Reflect.get(n(e + 8), t(e + 16)));
            },
            "syscall/js.valueSetIndex": function syscallJsValueSetIndex(e) {
              (e >>>= 0), Reflect.set(n(e + 8), t(e + 16), n(e + 24));
            },
            "syscall/js.valueCall": function syscallJsValueCall(e) {
              e >>>= 0;

              try {
                var _t2 = n(e + 8),
                  _s2 = Reflect.get(_t2, a(e + 16)),
                  _i2 = r(e + 32),
                  _l = Reflect.apply(_s2, _t2, _i2);

                (e = _this._inst.exports.getsp() >>> 0),
                  o(e + 56, _l),
                  _this.mem.setUint8(e + 64, 1);
              } catch (t) {
                o(e + 56, t), _this.mem.setUint8(e + 64, 0);
              }
            },
            "syscall/js.valueInvoke": function syscallJsValueInvoke(e) {
              e >>>= 0;

              try {
                var _t3 = n(e + 8),
                  _s3 = r(e + 16),
                  _i3 = Reflect.apply(_t3, void 0, _s3);

                (e = _this._inst.exports.getsp() >>> 0),
                  o(e + 40, _i3),
                  _this.mem.setUint8(e + 48, 1);
              } catch (t) {
                o(e + 40, t), _this.mem.setUint8(e + 48, 0);
              }
            },
            "syscall/js.valueNew": function syscallJsValueNew(e) {
              e >>>= 0;

              try {
                var _t4 = n(e + 8),
                  _s4 = r(e + 16),
                  _i4 = Reflect.construct(_t4, _s4);

                (e = _this._inst.exports.getsp() >>> 0),
                  o(e + 40, _i4),
                  _this.mem.setUint8(e + 48, 1);
              } catch (t) {
                o(e + 40, t), _this.mem.setUint8(e + 48, 0);
              }
            },
            "syscall/js.valueLength": function syscallJsValueLength(t) {
              e((t >>>= 0) + 16, parseInt(n(t + 8).length));
            },
            "syscall/js.valuePrepareString": function syscallJsValuePrepareString(
              t
            ) {
              t >>>= 0;
              var i = s.encode(String(n(t + 8)));
              o(t + 16, i), e(t + 24, i.length);
            },
            "syscall/js.valueLoadString": function syscallJsValueLoadString(e) {
              var t = n((e >>>= 0) + 8);
              l(e + 16).set(t);
            },
            "syscall/js.valueInstanceOf": function syscallJsValueInstanceOf(e) {
              (e >>>= 0),
                _this.mem.setUint8(
                  e + 24,
                  n(e + 8) instanceof n(e + 16) ? 1 : 0
                );
            },
            "syscall/js.copyBytesToGo": function syscallJsCopyBytesToGo(t) {
              var s = l((t >>>= 0) + 8),
                i = n(t + 32);
              if (!(i instanceof Uint8Array || i instanceof Uint8ClampedArray))
                return void _this.mem.setUint8(t + 48, 0);
              var o = i.subarray(0, s.length);
              s.set(o), e(t + 40, o.length), _this.mem.setUint8(t + 48, 1);
            },
            "syscall/js.copyBytesToJS": function syscallJsCopyBytesToJS(t) {
              var s = n((t >>>= 0) + 8),
                i = l(t + 16);
              if (!(s instanceof Uint8Array || s instanceof Uint8ClampedArray))
                return void _this.mem.setUint8(t + 48, 0);
              var o = i.subarray(0, s.length);
              s.set(o), e(t + 40, o.length), _this.mem.setUint8(t + 48, 1);
            },
            debug: function debug(e) {
              console.log(e);
            }
          }
        };
      }

      _createClass(_class, [
        {
          key: "run",
          value: (function () {
            var _run = _asyncToGenerator(
              /*#__PURE__*/ regeneratorRuntime.mark(function _callee(e) {
                var _this2 = this;

                var t, i, n, o, l;
                return regeneratorRuntime.wrap(
                  function _callee$(_context) {
                    while (1) {
                      switch ((_context.prev = _context.next)) {
                        case 0:
                          if (e instanceof WebAssembly.Instance) {
                            _context.next = 2;
                            break;
                          }

                          throw new Error(
                            "Go.run: WebAssembly.Instance expected"
                          );

                        case 2:
                          (this._inst = e),
                            (this.mem = new DataView(
                              this._inst.exports.mem.buffer
                            )),
                            (this._values = [
                              NaN,
                              0,
                              null,
                              !0,
                              !1,
                              global,
                              this
                            ]),
                            (this._goRefCounts = new Array(
                              this._values.length
                            ).fill(1 / 0)),
                            (this._ids = new Map([
                              [0, 1],
                              [null, 2],
                              [!0, 3],
                              [!1, 4],
                              [global, 5],
                              [this, 6]
                            ])),
                            (this._idPool = []),
                            (this.exited = !1);
                          t = 4096;
                          (i = function i(e) {
                            var i = t,
                              n = s.encode(e + "\0");
                            return (
                              new Uint8Array(
                                _this2.mem.buffer,
                                t,
                                n.length
                              ).set(n),
                              (t += n.length) % 8 != 0 && (t += 8 - (t % 8)),
                              i
                            );
                          }),
                            (n = this.argv.length),
                            (o = []);
                          this.argv.forEach(function (e) {
                            o.push(i(e));
                          }),
                            o.push(0),
                            Object.keys(this.env)
                              .sort()
                              .forEach(function (e) {
                                o.push(
                                  i("".concat(e, "=").concat(_this2.env[e]))
                                );
                              }),
                            o.push(0);
                          l = t;
                          o.forEach(function (e) {
                            _this2.mem.setUint32(t, e, !0),
                              _this2.mem.setUint32(t + 4, 0, !0),
                              (t += 8);
                          });

                          this._inst.exports.run(n, l);

                          this.exited && this._resolveExitPromise();
                          _context.next = 12;
                          return this._exitPromise;

                        case 12:
                        case "end":
                          return _context.stop();
                      }
                    }
                  },
                  _callee,
                  this
                );
              })
            );

            function run(_x) {
              return _run.apply(this, arguments);
            }

            return run;
          })()
        },
        {
          key: "_resume",
          value: function _resume() {
            if (this.exited) throw new Error("Go program has already exited");
            this._inst.exports.resume(),
              this.exited && this._resolveExitPromise();
          }
        },
        {
          key: "_makeFuncWrapper",
          value: function _makeFuncWrapper(e) {
            var t = this;
            return function () {
              var s = {
                id: e,
                this: this,
                args: arguments
              };
              return (t._pendingEvent = s), t._resume(), s.result;
            };
          }
        }
      ]);

      return _class;
    })()),
    "undefined" != typeof module &&
      global.require &&
      global.require.main === module &&
      global.process &&
      global.process.versions &&
      !global.process.versions.electron)
  ) {
    process.argv.length < 3 &&
      (console.error("usage: go_js_wasm_exec [wasm binary] [arguments]"),
      process.exit(1));

    var _e7 = new Go();

    (_e7.argv = process.argv.slice(2)),
      (_e7.env = Object.assign(
        {
          TMPDIR: require("os").tmpdir()
        },
        process.env
      )),
      (_e7.exit = process.exit),
      WebAssembly.instantiate(
        fs.readFileSync(process.argv[2]),
        _e7.importObject
      )
        .then(function (t) {
          return (
            process.on("exit", function (t) {
              0 !== t ||
                _e7.exited ||
                ((_e7._pendingEvent = {
                  id: 0
                }),
                _e7._resume());
            }),
            _e7.run(t.instance)
          );
        })
        .catch(function (e) {
          console.error(e), process.exit(1);
        });
  }
})();
