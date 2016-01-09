/* */ 
(function(process) {
  module.exports = asyncMap;
  function asyncMap() {
    var steps = Array.prototype.slice.call(arguments),
        list = steps.shift() || [],
        cb_ = steps.pop();
    if (typeof cb_ !== "function")
      throw new Error("No callback provided to asyncMap");
    if (!list)
      return cb_(null, []);
    if (!Array.isArray(list))
      list = [list];
    var n = steps.length,
        data = [],
        errState = null,
        l = list.length,
        a = l * n;
    if (!a)
      return cb_(null, []);
    function cb(er) {
      if (er && !errState)
        errState = er;
      var argLen = arguments.length;
      for (var i = 1; i < argLen; i++)
        if (arguments[i] !== undefined) {
          data[i - 1] = (data[i - 1] || []).concat(arguments[i]);
        }
      if (list.length > l) {
        var newList = list.slice(l);
        a += (list.length - l) * n;
        l = list.length;
        process.nextTick(function() {
          newList.forEach(function(ar) {
            steps.forEach(function(fn) {
              fn(ar, cb);
            });
          });
        });
      }
      if (--a === 0)
        cb_.apply(null, [errState].concat(data));
    }
    list.forEach(function(ar) {
      steps.forEach(function(fn) {
        fn(ar, cb);
      });
    });
  }
})(require('process'));
