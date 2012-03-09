//  ********** Library dart:core **************
//  ********** Natives dart:core **************
function $defProp(obj, prop, value) {
  Object.defineProperty(obj, prop,
      {value: value, enumerable: false, writable: true, configurable: true});
}
function $throw(e) {
  // If e is not a value, we can use V8's captureStackTrace utility method.
  // TODO(jmesserly): capture the stack trace on other JS engines.
  if (e && (typeof e == 'object') && Error.captureStackTrace) {
    // TODO(jmesserly): this will clobber the e.stack property
    Error.captureStackTrace(e, $throw);
  }
  throw e;
}
$defProp(Object.prototype, '$index', function(i) {
  $throw(new NoSuchMethodException(this, "operator []", [i]));
});
$defProp(Array.prototype, '$index', function(index) {
  var i = index | 0;
  if (i !== index) {
    throw new IllegalArgumentException('index is not int');
  } else if (i < 0 || i >= this.length) {
    throw new IndexOutOfRangeException(index);
  }
  return this[i];
});
$defProp(String.prototype, '$index', function(i) {
  return this[i];
});
$defProp(Object.prototype, '$setindex', function(i, value) {
  $throw(new NoSuchMethodException(this, "operator []=", [i, value]));
});
$defProp(Array.prototype, '$setindex', function(index, value) {
  var i = index | 0;
  if (i !== index) {
    throw new IllegalArgumentException('index is not int');
  } else if (i < 0 || i >= this.length) {
    throw new IndexOutOfRangeException(index);
  }
  return this[i] = value;
});
function $add$complex$(x, y) {
  if (typeof(x) == 'number') {
    $throw(new IllegalArgumentException(y));
  } else if (typeof(x) == 'string') {
    var str = (y == null) ? 'null' : y.toString();
    if (typeof(str) != 'string') {
      throw new Error("calling toString() on right hand operand of operator " +
      "+ did not return a String");
    }
    return x + str;
  } else if (typeof(x) == 'object') {
    return x.$add(y);
  } else {
    $throw(new NoSuchMethodException(x, "operator +", [y]));
  }
}

function $add$(x, y) {
  if (typeof(x) == 'number' && typeof(y) == 'number') return x + y;
  return $add$complex$(x, y);
}
function $eq$(x, y) {
  if (x == null) return y == null;
  return (typeof(x) != 'object') ? x === y : x.$eq(y);
}
// TODO(jimhug): Should this or should it not match equals?
$defProp(Object.prototype, '$eq', function(other) {
  return this === other;
});
function $ne$(x, y) {
  if (x == null) return y != null;
  return (typeof(x) != 'object') ? x !== y : !x.$eq(y);
}
function $sub$complex$(x, y) {
  if (typeof(x) == 'number') {
    $throw(new IllegalArgumentException(y));
  } else if (typeof(x) == 'object') {
    return x.$sub(y);
  } else {
    $throw(new NoSuchMethodException(x, "operator -", [y]));
  }
}
function $sub$(x, y) {
  if (typeof(x) == 'number' && typeof(y) == 'number') return x - y;
  return $sub$complex$(x, y);
}
function $truncdiv$(x, y) {
  if (typeof(x) == 'number') {
    if (typeof(y) == 'number') {
      if (y == 0) $throw(new IntegerDivisionByZeroException());
      var tmp = x / y;
      return (tmp < 0) ? Math.ceil(tmp) : Math.floor(tmp);
    } else {
      $throw(new IllegalArgumentException(y));
    }
  } else if (typeof(x) == 'object') {
    return x.$truncdiv(y);
  } else {
    $throw(new NoSuchMethodException(x, "operator ~/", [y]));
  }
}
// ********** Code for Object **************
$defProp(Object.prototype, "is$Collection", function() {
  return false;
});
$defProp(Object.prototype, "is$List", function() {
  return false;
});
$defProp(Object.prototype, "is$Map", function() {
  return false;
});
// ********** Code for IndexOutOfRangeException **************
function IndexOutOfRangeException(_index) {
  this._index = _index;
}
IndexOutOfRangeException.prototype.is$IndexOutOfRangeException = function(){return true};
IndexOutOfRangeException.prototype.toString = function() {
  return ("IndexOutOfRangeException: " + this._index);
}
// ********** Code for IllegalAccessException **************
function IllegalAccessException() {

}
IllegalAccessException.prototype.toString = function() {
  return "Attempt to modify an immutable object";
}
// ********** Code for NoSuchMethodException **************
function NoSuchMethodException(_receiver, _functionName, _arguments, _existingArgumentNames) {
  this._receiver = _receiver;
  this._functionName = _functionName;
  this._arguments = _arguments;
  this._existingArgumentNames = _existingArgumentNames;
}
NoSuchMethodException.prototype.is$NoSuchMethodException = function(){return true};
NoSuchMethodException.prototype.toString = function() {
  var sb = new StringBufferImpl("");
  for (var i = (0);
   i < this._arguments.get$length(); i++) {
    if (i > (0)) {
      sb.add(", ");
    }
    sb.add(this._arguments.$index(i));
  }
  if (null == this._existingArgumentNames) {
    return $add$($add$(("NoSuchMethodException : method not found: '" + this._functionName + "'\n"), ("Receiver: " + this._receiver + "\n")), ("Arguments: [" + sb + "]"));
  }
  else {
    var actualParameters = sb.toString();
    sb = new StringBufferImpl("");
    for (var i = (0);
     i < this._existingArgumentNames.get$length(); i++) {
      if (i > (0)) {
        sb.add(", ");
      }
      sb.add(this._existingArgumentNames.$index(i));
    }
    var formalParameters = sb.toString();
    return $add$($add$($add$("NoSuchMethodException: incorrect number of arguments passed to ", ("method named '" + this._functionName + "'\nReceiver: " + this._receiver + "\n")), ("Tried calling: " + this._functionName + "(" + actualParameters + ")\n")), ("Found: " + this._functionName + "(" + formalParameters + ")"));
  }
}
// ********** Code for ClosureArgumentMismatchException **************
function ClosureArgumentMismatchException() {

}
ClosureArgumentMismatchException.prototype.toString = function() {
  return "Closure argument mismatch";
}
// ********** Code for ObjectNotClosureException **************
function ObjectNotClosureException() {

}
ObjectNotClosureException.prototype.toString = function() {
  return "Object is not closure";
}
// ********** Code for IllegalArgumentException **************
function IllegalArgumentException(arg) {
  this._arg = arg;
}
IllegalArgumentException.prototype.is$IllegalArgumentException = function(){return true};
IllegalArgumentException.prototype.toString = function() {
  return ("Illegal argument(s): " + this._arg);
}
// ********** Code for StackOverflowException **************
function StackOverflowException() {

}
StackOverflowException.prototype.toString = function() {
  return "Stack Overflow";
}
// ********** Code for BadNumberFormatException **************
function BadNumberFormatException(_s) {
  this._s = _s;
}
BadNumberFormatException.prototype.toString = function() {
  return ("BadNumberFormatException: '" + this._s + "'");
}
// ********** Code for NullPointerException **************
function NullPointerException() {

}
NullPointerException.prototype.toString = function() {
  return "NullPointerException";
}
// ********** Code for NoMoreElementsException **************
function NoMoreElementsException() {

}
NoMoreElementsException.prototype.toString = function() {
  return "NoMoreElementsException";
}
// ********** Code for UnsupportedOperationException **************
function UnsupportedOperationException(_message) {
  this._message = _message;
}
UnsupportedOperationException.prototype.toString = function() {
  return ("UnsupportedOperationException: " + this._message);
}
// ********** Code for IntegerDivisionByZeroException **************
function IntegerDivisionByZeroException() {

}
IntegerDivisionByZeroException.prototype.is$IntegerDivisionByZeroException = function(){return true};
IntegerDivisionByZeroException.prototype.toString = function() {
  return "IntegerDivisionByZeroException";
}
// ********** Code for dart_core_Function **************
Function.prototype.to$call$0 = function() {
  this.call$0 = this._genStub(0);
  this.to$call$0 = function() { return this.call$0; };
  return this.call$0;
};
Function.prototype.call$0 = function() {
  return this.to$call$0()();
};
function to$call$0(f) { return f && f.to$call$0(); }
Function.prototype.to$call$1 = function() {
  this.call$1 = this._genStub(1);
  this.to$call$1 = function() { return this.call$1; };
  return this.call$1;
};
Function.prototype.call$1 = function($0) {
  return this.to$call$1()($0);
};
function to$call$1(f) { return f && f.to$call$1(); }
Function.prototype.to$call$2 = function() {
  this.call$2 = this._genStub(2);
  this.to$call$2 = function() { return this.call$2; };
  return this.call$2;
};
Function.prototype.call$2 = function($0, $1) {
  return this.to$call$2()($0, $1);
};
function to$call$2(f) { return f && f.to$call$2(); }
// ********** Code for FutureNotCompleteException **************
function FutureNotCompleteException() {

}
FutureNotCompleteException.prototype.toString = function() {
  return "Exception: future has not been completed";
}
// ********** Code for FutureAlreadyCompleteException **************
function FutureAlreadyCompleteException() {

}
FutureAlreadyCompleteException.prototype.toString = function() {
  return "Exception: future already completed";
}
// ********** Code for Math **************
// ********** Code for top level **************
function _toDartException(e) {
  function attachStack(dartEx) {
    // TODO(jmesserly): setting the stack property is not a long term solution.
    var stack = e.stack;
    // The stack contains the error message, and the stack is all that is
    // printed (the exception's toString() is never called).  Make the Dart
    // exception's toString() be the dominant message.
    if (typeof stack == 'string') {
      var message = dartEx.toString();
      if (/^(Type|Range)Error:/.test(stack)) {
        // Indent JS message (it can be helpful) so new message stands out.
        stack = '    (' + stack.substring(0, stack.indexOf('\n')) + ')\n' +
                stack.substring(stack.indexOf('\n') + 1);
      }
      stack = message + '\n' + stack;
    }
    dartEx.stack = stack;
    return dartEx;
  }

  if (e instanceof TypeError) {
    switch(e.type) {
      case 'property_not_function':
      case 'called_non_callable':
        if (e.arguments[0] == null) {
          return attachStack(new NullPointerException());
        } else {
          return attachStack(new ObjectNotClosureException());
        }
        break;
      case 'non_object_property_call':
      case 'non_object_property_load':
        return attachStack(new NullPointerException());
        break;
      case 'undefined_method':
        var mname = e.arguments[0];
        if (typeof(mname) == 'string' && (mname.indexOf('call$') == 0
            || mname == 'call' || mname == 'apply')) {
          return attachStack(new ObjectNotClosureException());
        } else {
          // TODO(jmesserly): fix noSuchMethod on operators so we don't hit this
          return attachStack(new NoSuchMethodException('', e.arguments[0], []));
        }
        break;
    }
  } else if (e instanceof RangeError) {
    if (e.message.indexOf('call stack') >= 0) {
      return attachStack(new StackOverflowException());
    }
  }
  return e;
}
//  ********** Library dart:coreimpl **************
// ********** Code for ListFactory **************
ListFactory = Array;
$defProp(ListFactory.prototype, "is$List", function(){return true});
$defProp(ListFactory.prototype, "is$Collection", function(){return true});
$defProp(ListFactory.prototype, "get$length", function() { return this.length; });
$defProp(ListFactory.prototype, "set$length", function(value) { return this.length = value; });
$defProp(ListFactory.prototype, "add", function(value) {
  this.push(value);
});
$defProp(ListFactory.prototype, "clear", function() {
  this.set$length((0));
});
$defProp(ListFactory.prototype, "removeLast", function() {
  return this.pop();
});
$defProp(ListFactory.prototype, "iterator", function() {
  return new ListIterator(this);
});
$defProp(ListFactory.prototype, "toString", function() {
  return Collections.collectionToString(this);
});
// ********** Code for ListIterator **************
function ListIterator(array) {
  this._array = array;
  this._pos = (0);
}
ListIterator.prototype.hasNext = function() {
  return this._array.get$length() > this._pos;
}
ListIterator.prototype.next = function() {
  if (!this.hasNext()) {
    $throw(const$0001);
  }
  return this._array.$index(this._pos++);
}
// ********** Code for ImmutableList **************
/** Implements extends for Dart classes on JavaScript prototypes. */
function $inherits(child, parent) {
  if (child.prototype.__proto__) {
    child.prototype.__proto__ = parent.prototype;
  } else {
    function tmp() {};
    tmp.prototype = parent.prototype;
    child.prototype = new tmp();
    child.prototype.constructor = child;
  }
}
$inherits(ImmutableList, ListFactory);
function ImmutableList(length) {
  Array.call(this, length);
}
ImmutableList.ImmutableList$from$factory = function(other) {
  return _constList(other);
}
ImmutableList.prototype.get$length = function() {
  return this.length;
}
ImmutableList.prototype.set$length = function(length) {
  $throw(const$0002);
}
ImmutableList.prototype.$setindex = function(index, value) {
  $throw(const$0002);
}
ImmutableList.prototype.add = function(element) {
  $throw(const$0002);
}
ImmutableList.prototype.clear = function() {
  $throw(const$0002);
}
ImmutableList.prototype.removeLast = function() {
  $throw(const$0002);
}
ImmutableList.prototype.toString = function() {
  return Collections.collectionToString(this);
}
// ********** Code for NumImplementation **************
NumImplementation = Number;
NumImplementation.prototype.floor = function() {
  'use strict'; return Math.floor(this);
}
NumImplementation.prototype.ceil = function() {
  'use strict'; return Math.ceil(this);
}
NumImplementation.prototype.hashCode = function() {
  'use strict'; return this & 0x1FFFFFFF;
}
NumImplementation.prototype.toInt = function() {
    'use strict';
    if (isNaN(this)) $throw(new BadNumberFormatException("NaN"));
    if ((this == Infinity) || (this == -Infinity)) {
      $throw(new BadNumberFormatException("Infinity"));
    }
    var truncated = (this < 0) ? Math.ceil(this) : Math.floor(this);
    if (truncated == -0.0) return 0;
    return truncated;
}
// ********** Code for Collections **************
function Collections() {}
Collections.collectionToString = function(c) {
  var result = new StringBufferImpl("");
  Collections._emitCollection(c, result, new Array());
  return result.toString();
}
Collections._emitCollection = function(c, result, visiting) {
  visiting.add(c);
  var isList = !!(c && c.is$List());
  result.add(isList ? "[" : "{");
  var first = true;
  for (var $$i = c.iterator(); $$i.hasNext(); ) {
    var e = $$i.next();
    if (!first) {
      result.add(", ");
    }
    first = false;
    Collections._emitObject(e, result, visiting);
  }
  result.add(isList ? "]" : "}");
  visiting.removeLast();
}
Collections._emitObject = function(o, result, visiting) {
  if (!!(o && o.is$Collection())) {
    if (Collections._containsRef(visiting, o)) {
      result.add(!!(o && o.is$List()) ? "[...]" : "{...}");
    }
    else {
      Collections._emitCollection(o, result, visiting);
    }
  }
  else if (!!(o && o.is$Map())) {
    if (Collections._containsRef(visiting, o)) {
      result.add("{...}");
    }
    else {
      Maps._emitMap(o, result, visiting);
    }
  }
  else {
    result.add($eq$(o) ? "null" : o);
  }
}
Collections._containsRef = function(c, ref) {
  for (var $$i = c.iterator(); $$i.hasNext(); ) {
    var e = $$i.next();
    if ((null == e ? null == (ref) : e === ref)) return true;
  }
  return false;
}
// ********** Code for FutureImpl **************
function FutureImpl() {
  this._listeners = new Array();
  this._exceptionHandlers = new Array();
  this._isComplete = false;
  this._exceptionHandled = false;
}
FutureImpl.prototype.get$value = function() {
  if (!this.get$isComplete()) {
    $throw(new FutureNotCompleteException());
  }
  if (null != this._exception) {
    $throw(this._exception);
  }
  return this._value;
}
FutureImpl.prototype.get$isComplete = function() {
  return this._isComplete;
}
FutureImpl.prototype.get$hasValue = function() {
  return this.get$isComplete() && null == this._exception;
}
FutureImpl.prototype.then = function(onComplete) {
  if (this.get$hasValue()) {
    onComplete(this.get$value());
  }
  else if (!this.get$isComplete()) {
    this._listeners.add(onComplete);
  }
  else if (!this._exceptionHandled) {
    $throw(this._exception);
  }
}
FutureImpl.prototype._complete = function() {
  this._isComplete = true;
  if (null != this._exception) {
    var $$list = this._exceptionHandlers;
    for (var $$i = $$list.iterator(); $$i.hasNext(); ) {
      var handler = $$i.next();
      if (handler.call$1(this._exception)) {
        this._exceptionHandled = true;
        break;
      }
    }
  }
  if (this.get$hasValue()) {
    var $$list = this._listeners;
    for (var $$i = $$list.iterator(); $$i.hasNext(); ) {
      var listener = $$i.next();
      listener.call$1(this.get$value());
    }
  }
  else {
    if (!this._exceptionHandled && this._listeners.get$length() > (0)) {
      $throw(this._exception);
    }
  }
}
FutureImpl.prototype._setValue = function(value) {
  if (this._isComplete) {
    $throw(new FutureAlreadyCompleteException());
  }
  this._value = value;
  this._complete();
}
FutureImpl.prototype._setException = function(exception) {
  if (null == exception) {
    $throw(new IllegalArgumentException(null));
  }
  if (this._isComplete) {
    $throw(new FutureAlreadyCompleteException());
  }
  this._exception = exception;
  this._complete();
}
// ********** Code for CompleterImpl **************
function CompleterImpl() {}
CompleterImpl.prototype.get$future = function() {
  return this._futureImpl;
}
CompleterImpl.prototype.complete = function(value) {
  this._futureImpl._setValue(value);
}
CompleterImpl.prototype.completeException = function(exception) {
  this._futureImpl._setException(exception);
}
// ********** Code for CompleterImpl_ElementRect **************
$inherits(CompleterImpl_ElementRect, CompleterImpl);
function CompleterImpl_ElementRect() {
  this._futureImpl = new FutureImpl();
}
// ********** Code for HashMapImplementation **************
function HashMapImplementation() {
  this._numberOfEntries = (0);
  this._numberOfDeleted = (0);
  this._loadLimit = HashMapImplementation._computeLoadLimit((8));
  this._keys = new Array((8));
  this._values = new Array((8));
}
HashMapImplementation.prototype.is$Map = function(){return true};
HashMapImplementation._computeLoadLimit = function(capacity) {
  return $truncdiv$((capacity * (3)), (4));
}
HashMapImplementation._firstProbe = function(hashCode, length) {
  return hashCode & (length - (1));
}
HashMapImplementation._nextProbe = function(currentProbe, numberOfProbes, length) {
  return (currentProbe + numberOfProbes) & (length - (1));
}
HashMapImplementation.prototype._probeForAdding = function(key) {
  var hash = HashMapImplementation._firstProbe(key.hashCode(), this._keys.get$length());
  var numberOfProbes = (1);
  var initialHash = hash;
  var insertionIndex = (-1);
  while (true) {
    var existingKey = this._keys.$index(hash);
    if (null == existingKey) {
      if (insertionIndex < (0)) return hash;
      return insertionIndex;
    }
    else if ($eq$(existingKey, key)) {
      return hash;
    }
    else if ((insertionIndex < (0)) && ((null == const$0000 ? null == (existingKey) : const$0000 === existingKey))) {
      insertionIndex = hash;
    }
    hash = HashMapImplementation._nextProbe(hash, numberOfProbes++, this._keys.get$length());
  }
}
HashMapImplementation.prototype._probeForLookup = function(key) {
  var hash = HashMapImplementation._firstProbe(key.hashCode(), this._keys.get$length());
  var numberOfProbes = (1);
  var initialHash = hash;
  while (true) {
    var existingKey = this._keys.$index(hash);
    if (null == existingKey) return (-1);
    if ($eq$(existingKey, key)) return hash;
    hash = HashMapImplementation._nextProbe(hash, numberOfProbes++, this._keys.get$length());
  }
}
HashMapImplementation.prototype._ensureCapacity = function() {
  var newNumberOfEntries = this._numberOfEntries + (1);
  if (newNumberOfEntries >= this._loadLimit) {
    this._grow(this._keys.get$length() * (2));
    return;
  }
  var capacity = this._keys.get$length();
  var numberOfFreeOrDeleted = capacity - newNumberOfEntries;
  var numberOfFree = numberOfFreeOrDeleted - this._numberOfDeleted;
  if (this._numberOfDeleted > numberOfFree) {
    this._grow(this._keys.get$length());
  }
}
HashMapImplementation._isPowerOfTwo = function(x) {
  return ((x & (x - (1))) == (0));
}
HashMapImplementation.prototype._grow = function(newCapacity) {
  var capacity = this._keys.get$length();
  this._loadLimit = HashMapImplementation._computeLoadLimit(newCapacity);
  var oldKeys = this._keys;
  var oldValues = this._values;
  this._keys = new Array(newCapacity);
  this._values = new Array(newCapacity);
  for (var i = (0);
   i < capacity; i++) {
    var key = oldKeys.$index(i);
    if (null == key || (null == key ? null == (const$0000) : key === const$0000)) {
      continue;
    }
    var value = oldValues.$index(i);
    var newIndex = this._probeForAdding(key);
    this._keys.$setindex(newIndex, key);
    this._values.$setindex(newIndex, value);
  }
  this._numberOfDeleted = (0);
}
HashMapImplementation.prototype.$setindex = function(key, value) {
  var $0;
  this._ensureCapacity();
  var index = this._probeForAdding(key);
  if ((null == this._keys.$index(index)) || ((($0 = this._keys.$index(index)) == null ? null == (const$0000) : $0 === const$0000))) {
    this._numberOfEntries++;
  }
  this._keys.$setindex(index, key);
  this._values.$setindex(index, value);
}
HashMapImplementation.prototype.$index = function(key) {
  var index = this._probeForLookup(key);
  if (index < (0)) return null;
  return this._values.$index(index);
}
HashMapImplementation.prototype.forEach = function(f) {
  var length = this._keys.get$length();
  for (var i = (0);
   i < length; i++) {
    var key = this._keys.$index(i);
    if ((null != key) && ((null == key ? null != (const$0000) : key !== const$0000))) {
      f(key, this._values.$index(i));
    }
  }
}
HashMapImplementation.prototype.toString = function() {
  return Maps.mapToString(this);
}
// ********** Code for HashSetImplementation **************
function HashSetImplementation() {}
HashSetImplementation.prototype.is$Collection = function(){return true};
HashSetImplementation.prototype.iterator = function() {
  return new HashSetIterator(this);
}
HashSetImplementation.prototype.toString = function() {
  return Collections.collectionToString(this);
}
// ********** Code for HashSetIterator **************
function HashSetIterator(set_) {
  this._entries = set_._backingMap._keys;
  this._nextValidIndex = (-1);
  this._advance();
}
HashSetIterator.prototype.hasNext = function() {
  var $0;
  if (this._nextValidIndex >= this._entries.get$length()) return false;
  if ((($0 = this._entries.$index(this._nextValidIndex)) == null ? null == (const$0000) : $0 === const$0000)) {
    this._advance();
  }
  return this._nextValidIndex < this._entries.get$length();
}
HashSetIterator.prototype.next = function() {
  if (!this.hasNext()) {
    $throw(const$0001);
  }
  var res = this._entries.$index(this._nextValidIndex);
  this._advance();
  return res;
}
HashSetIterator.prototype._advance = function() {
  var length = this._entries.get$length();
  var entry;
  var deletedKey = const$0000;
  do {
    if (++this._nextValidIndex >= length) break;
    entry = this._entries.$index(this._nextValidIndex);
  }
  while ((null == entry) || ((null == entry ? null == (deletedKey) : entry === deletedKey)))
}
// ********** Code for _DeletedKeySentinel **************
function _DeletedKeySentinel() {

}
// ********** Code for Maps **************
function Maps() {}
Maps.mapToString = function(m) {
  var result = new StringBufferImpl("");
  Maps._emitMap(m, result, new Array());
  return result.toString();
}
Maps._emitMap = function(m, result, visiting) {
  visiting.add(m);
  result.add("{");
  var first = true;
  m.forEach((function (k, v) {
    if (!first) {
      result.add(", ");
    }
    first = false;
    Collections._emitObject(k, result, visiting);
    result.add(": ");
    Collections._emitObject(v, result, visiting);
  })
  );
  result.add("}");
  visiting.removeLast();
}
// ********** Code for DoubleLinkedQueue **************
function DoubleLinkedQueue() {}
DoubleLinkedQueue.prototype.is$Collection = function(){return true};
DoubleLinkedQueue.prototype.iterator = function() {
  return new _DoubleLinkedQueueIterator(this._sentinel);
}
DoubleLinkedQueue.prototype.toString = function() {
  return Collections.collectionToString(this);
}
// ********** Code for _DoubleLinkedQueueIterator **************
function _DoubleLinkedQueueIterator(_sentinel) {
  this._sentinel = _sentinel;
  this._currentEntry = this._sentinel;
}
_DoubleLinkedQueueIterator.prototype.hasNext = function() {
  var $0;
  return (($0 = this._currentEntry._next) == null ? null != (this._sentinel) : $0 !== this._sentinel);
}
_DoubleLinkedQueueIterator.prototype.next = function() {
  if (!this.hasNext()) {
    $throw(const$0001);
  }
  this._currentEntry = this._currentEntry._next;
  return this._currentEntry.get$element();
}
// ********** Code for StringBufferImpl **************
function StringBufferImpl(content) {
  this.clear();
  this.add(content);
}
StringBufferImpl.prototype.add = function(obj) {
  var str = obj.toString();
  if (null == str || str.isEmpty()) return this;
  this._buffer.add(str);
  this._length = this._length + str.length;
  return this;
}
StringBufferImpl.prototype.clear = function() {
  this._buffer = new Array();
  this._length = (0);
  return this;
}
StringBufferImpl.prototype.toString = function() {
  if (this._buffer.get$length() == (0)) return "";
  if (this._buffer.get$length() == (1)) return this._buffer.$index((0));
  var result = StringBase.concatAll(this._buffer);
  this._buffer.clear();
  this._buffer.add(result);
  return result;
}
// ********** Code for StringBase **************
function StringBase() {}
StringBase.join = function(strings, separator) {
  if (strings.get$length() == (0)) return "";
  var s = strings.$index((0));
  for (var i = (1);
   i < strings.get$length(); i++) {
    s = $add$($add$(s, separator), strings.$index(i));
  }
  return s;
}
StringBase.concatAll = function(strings) {
  return StringBase.join(strings, "");
}
// ********** Code for StringImplementation **************
StringImplementation = String;
StringImplementation.prototype.isEmpty = function() {
  return this.length == (0);
}
StringImplementation.prototype.hashCode = function() {
      'use strict';
      var hash = 0;
      for (var i = 0; i < this.length; i++) {
        hash = 0x1fffffff & (hash + this.charCodeAt(i));
        hash = 0x1fffffff & (hash + ((0x0007ffff & hash) << 10));
        hash ^= hash >> 6;
      }

      hash = 0x1fffffff & (hash + ((0x03ffffff & hash) << 3));
      hash ^= hash >> 11;
      return 0x1fffffff & (hash + ((0x00003fff & hash) << 15));
}
// ********** Code for _ArgumentMismatchException **************
$inherits(_ArgumentMismatchException, ClosureArgumentMismatchException);
function _ArgumentMismatchException(_message) {
  this._dart_coreimpl_message = _message;
  ClosureArgumentMismatchException.call(this);
}
_ArgumentMismatchException.prototype.toString = function() {
  return ("Closure argument mismatch: " + this._dart_coreimpl_message);
}
// ********** Code for _FunctionImplementation **************
_FunctionImplementation = Function;
_FunctionImplementation.prototype._genStub = function(argsLength, names) {
      // Fast path #1: if no named arguments and arg count matches.
      var thisLength = this.$length || this.length;
      if (thisLength == argsLength && !names) {
        return this;
      }

      var paramsNamed = this.$optional ? (this.$optional.length / 2) : 0;
      var paramsBare = thisLength - paramsNamed;
      var argsNamed = names ? names.length : 0;
      var argsBare = argsLength - argsNamed;

      // Check we got the right number of arguments
      if (argsBare < paramsBare || argsLength > thisLength ||
          argsNamed > paramsNamed) {
        return function() {
          $throw(new _ArgumentMismatchException(
            'Wrong number of arguments to function. Expected ' + paramsBare +
            ' positional arguments and at most ' + paramsNamed +
            ' named arguments, but got ' + argsBare +
            ' positional arguments and ' + argsNamed + ' named arguments.'));
        };
      }

      // First, fill in all of the default values
      var p = new Array(paramsBare);
      if (paramsNamed) {
        p = p.concat(this.$optional.slice(paramsNamed));
      }
      // Fill in positional args
      var a = new Array(argsLength);
      for (var i = 0; i < argsBare; i++) {
        p[i] = a[i] = '$' + i;
      }
      // Then overwrite with supplied values for optional args
      var lastParameterIndex;
      var namesInOrder = true;
      for (var i = 0; i < argsNamed; i++) {
        var name = names[i];
        a[i + argsBare] = name;
        var j = this.$optional.indexOf(name);
        if (j < 0 || j >= paramsNamed) {
          return function() {
            $throw(new _ArgumentMismatchException(
              'Named argument "' + name + '" was not expected by function.' +
              ' Did you forget to mark the function parameter [optional]?'));
          };
        } else if (lastParameterIndex && lastParameterIndex > j) {
          namesInOrder = false;
        }
        p[j + paramsBare] = name;
        lastParameterIndex = j;
      }

      if (thisLength == argsLength && namesInOrder) {
        // Fast path #2: named arguments, but they're in order and all supplied.
        return this;
      }

      // Note: using Function instead of 'eval' to get a clean scope.
      // TODO(jmesserly): evaluate the performance of these stubs.
      var f = 'function(' + a.join(',') + '){return $f(' + p.join(',') + ');}';
      return new Function('$f', 'return ' + f + '').call(null, this);
    
}
// ********** Code for top level **************
function _constList(other) {
    other.__proto__ = ImmutableList.prototype;
    return other;
}
//  ********** Library html **************
// ********** Code for _EventTargetImpl **************
$defProp(Object.prototype, '$typeNameOf', (function() {
  function constructorNameWithFallback(obj) {
    var constructor = obj.constructor;
    if (typeof(constructor) == 'function') {
      // The constructor isn't null or undefined at this point. Try
      // to grab hold of its name.
      var name = constructor.name;
      // If the name is a non-empty string, we use that as the type
      // name of this object. On Firefox, we often get 'Object' as
      // the constructor name even for more specialized objects so
      // we have to fall through to the toString() based implementation
      // below in that case.
      if (typeof(name) == 'string' && name && name != 'Object') return name;
    }
    var string = Object.prototype.toString.call(obj);
    return string.substring(8, string.length - 1);
  }

  function chrome$typeNameOf() {
    var name = this.constructor.name;
    if (name == 'Window') return 'DOMWindow';
    return name;
  }

  function firefox$typeNameOf() {
    var name = constructorNameWithFallback(this);
    if (name == 'Window') return 'DOMWindow';
    if (name == 'Document') return 'HTMLDocument';
    if (name == 'XMLDocument') return 'Document';
    return name;
  }

  function ie$typeNameOf() {
    var name = constructorNameWithFallback(this);
    if (name == 'Window') return 'DOMWindow';
    // IE calls both HTML and XML documents 'Document', so we check for the
    // xmlVersion property, which is the empty string on HTML documents.
    if (name == 'Document' && this.xmlVersion) return 'Document';
    if (name == 'Document') return 'HTMLDocument';
    return name;
  }

  // If we're not in the browser, we're almost certainly running on v8.
  if (typeof(navigator) != 'object') return chrome$typeNameOf;

  var userAgent = navigator.userAgent;
  if (/Chrome|DumpRenderTree/.test(userAgent)) return chrome$typeNameOf;
  if (/Firefox/.test(userAgent)) return firefox$typeNameOf;
  if (/MSIE/.test(userAgent)) return ie$typeNameOf;
  return function() { return constructorNameWithFallback(this); };
})());
function $dynamic(name) {
  var f = Object.prototype[name];
  if (f && f.methods) return f.methods;

  var methods = {};
  if (f) methods.Object = f;
  function $dynamicBind() {
    // Find the target method
    var obj = this;
    var tag = obj.$typeNameOf();
    var method = methods[tag];
    if (!method) {
      var table = $dynamicMetadata;
      for (var i = 0; i < table.length; i++) {
        var entry = table[i];
        if (entry.map.hasOwnProperty(tag)) {
          method = methods[entry.tag];
          if (method) break;
        }
      }
    }
    method = method || methods.Object;
    var proto = Object.getPrototypeOf(obj);
    if (!proto.hasOwnProperty(name)) {
      $defProp(proto, name, method);
    }

    return method.apply(this, Array.prototype.slice.call(arguments));
  };
  $dynamicBind.methods = methods;
  $defProp(Object.prototype, name, $dynamicBind);
  return methods;
}
if (typeof $dynamicMetadata == 'undefined') $dynamicMetadata = [];
$dynamic("_addEventListener").EventTarget = function(type, listener, useCapture) {
  this.addEventListener(type, listener, useCapture);
}
// ********** Code for _NodeImpl **************
$dynamic("get$text").Node = function() {
  return this.textContent;
}
$dynamic("set$text").Node = function(value) {
  this.textContent = value;
}
$dynamic("_appendChild").Node = function(newChild) {
  return this.appendChild(newChild);
}
$dynamic("_removeChild").Node = function(oldChild) {
  return this.removeChild(oldChild);
}
$dynamic("_replaceChild").Node = function(newChild, oldChild) {
  return this.replaceChild(newChild, oldChild);
}
// ********** Code for _ElementImpl **************
$dynamic("get$rect").Element = function() {
  var $this = this; // closure support
  return _createMeasurementFuture((function () {
    return new _ElementRectImpl($this);
  })
  , new CompleterImpl_ElementRect());
}
$dynamic("get$_clientHeight").Element = function() {
  return this.clientHeight;
}
$dynamic("get$_clientLeft").Element = function() {
  return this.clientLeft;
}
$dynamic("get$_clientTop").Element = function() {
  return this.clientTop;
}
$dynamic("get$_clientWidth").Element = function() {
  return this.clientWidth;
}
$dynamic("set$innerHTML").Element = function(value) { return this.innerHTML = value; };
$dynamic("get$_offsetHeight").Element = function() {
  return this.offsetHeight;
}
$dynamic("get$_offsetLeft").Element = function() {
  return this.offsetLeft;
}
$dynamic("get$_offsetTop").Element = function() {
  return this.offsetTop;
}
$dynamic("get$_offsetWidth").Element = function() {
  return this.offsetWidth;
}
$dynamic("get$_scrollHeight").Element = function() {
  return this.scrollHeight;
}
$dynamic("get$_scrollLeft").Element = function() {
  return this.scrollLeft;
}
$dynamic("get$_scrollTop").Element = function() {
  return this.scrollTop;
}
$dynamic("get$_scrollWidth").Element = function() {
  return this.scrollWidth;
}
$dynamic("get$on").Element = function() {
  return new _ElementEventsImpl(this);
}
$dynamic("_getBoundingClientRect").Element = function() {
  return this.getBoundingClientRect();
}
$dynamic("_getClientRects").Element = function() {
  return this.getClientRects();
}
$dynamic("query").Element = function(selectors) {
  return this.querySelector(selectors);
}
// ********** Code for _HTMLElementImpl **************
// ********** Code for _AbstractWorkerImpl **************
$dynamic("_addEventListener").AbstractWorker = function(type, listener, useCapture) {
  this.addEventListener(type, listener, useCapture);
}
// ********** Code for _AnchorElementImpl **************
// ********** Code for _AnimationImpl **************
// ********** Code for _EventImpl **************
// ********** Code for _AnimationEventImpl **************
// ********** Code for _AnimationListImpl **************
// ********** Code for _AppletElementImpl **************
// ********** Code for _AreaElementImpl **************
// ********** Code for _ArrayBufferImpl **************
// ********** Code for _ArrayBufferViewImpl **************
// ********** Code for _AttrImpl **************
// ********** Code for _AudioBufferImpl **************
// ********** Code for _AudioNodeImpl **************
// ********** Code for _AudioSourceNodeImpl **************
// ********** Code for _AudioBufferSourceNodeImpl **************
// ********** Code for _AudioChannelMergerImpl **************
// ********** Code for _AudioChannelSplitterImpl **************
// ********** Code for _AudioContextImpl **************
// ********** Code for _AudioDestinationNodeImpl **************
// ********** Code for _MediaElementImpl **************
// ********** Code for _AudioElementImpl **************
// ********** Code for _AudioParamImpl **************
// ********** Code for _AudioGainImpl **************
// ********** Code for _AudioGainNodeImpl **************
// ********** Code for _AudioListenerImpl **************
// ********** Code for _AudioPannerNodeImpl **************
// ********** Code for _AudioProcessingEventImpl **************
// ********** Code for _BRElementImpl **************
// ********** Code for _BarInfoImpl **************
// ********** Code for _BaseElementImpl **************
// ********** Code for _BaseFontElementImpl **************
$dynamic("get$color").HTMLBaseFontElement = function() { return this.color; };
// ********** Code for _BeforeLoadEventImpl **************
// ********** Code for _BiquadFilterNodeImpl **************
// ********** Code for _BlobImpl **************
// ********** Code for _BlobBuilderImpl **************
// ********** Code for _BodyElementImpl **************
$dynamic("get$on").HTMLBodyElement = function() {
  return new _BodyElementEventsImpl(this);
}
// ********** Code for _EventsImpl **************
function _EventsImpl(_ptr) {
  this._ptr = _ptr;
}
_EventsImpl.prototype._get = function(type) {
  return new _EventListenerListImpl(this._ptr, type);
}
// ********** Code for _ElementEventsImpl **************
$inherits(_ElementEventsImpl, _EventsImpl);
function _ElementEventsImpl(_ptr) {
  _EventsImpl.call(this, _ptr);
}
_ElementEventsImpl.prototype.get$touchMove = function() {
  return this._get("touchmove");
}
_ElementEventsImpl.prototype.get$touchStart = function() {
  return this._get("touchstart");
}
// ********** Code for _BodyElementEventsImpl **************
$inherits(_BodyElementEventsImpl, _ElementEventsImpl);
function _BodyElementEventsImpl(_ptr) {
  _ElementEventsImpl.call(this, _ptr);
}
// ********** Code for _ButtonElementImpl **************
// ********** Code for _CharacterDataImpl **************
// ********** Code for _TextImpl **************
// ********** Code for _CDATASectionImpl **************
// ********** Code for _CSSRuleImpl **************
// ********** Code for _CSSCharsetRuleImpl **************
// ********** Code for _CSSFontFaceRuleImpl **************
// ********** Code for _CSSImportRuleImpl **************
// ********** Code for _CSSKeyframeRuleImpl **************
// ********** Code for _CSSKeyframesRuleImpl **************
// ********** Code for _CSSMatrixImpl **************
// ********** Code for _CSSMediaRuleImpl **************
// ********** Code for _CSSPageRuleImpl **************
// ********** Code for _CSSValueImpl **************
// ********** Code for _CSSPrimitiveValueImpl **************
// ********** Code for _CSSRuleListImpl **************
// ********** Code for _CSSStyleDeclarationImpl **************
$dynamic("get$color").CSSStyleDeclaration = function() {
  return this.getPropertyValue("color");
}
// ********** Code for _CSSStyleRuleImpl **************
// ********** Code for _StyleSheetImpl **************
// ********** Code for _CSSStyleSheetImpl **************
// ********** Code for _CSSValueListImpl **************
// ********** Code for _CSSTransformValueImpl **************
// ********** Code for _CSSUnknownRuleImpl **************
// ********** Code for _CanvasElementImpl **************
// ********** Code for _CanvasGradientImpl **************
// ********** Code for _CanvasPatternImpl **************
// ********** Code for _CanvasPixelArrayImpl **************
$dynamic("is$List").CanvasPixelArray = function(){return true};
$dynamic("is$Collection").CanvasPixelArray = function(){return true};
$dynamic("get$length").CanvasPixelArray = function() { return this.length; };
$dynamic("$index").CanvasPixelArray = function(index) {
  return this[index];
}
$dynamic("$setindex").CanvasPixelArray = function(index, value) {
  this[index] = value
}
$dynamic("iterator").CanvasPixelArray = function() {
  return new _FixedSizeListIterator_int(this);
}
$dynamic("add").CanvasPixelArray = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
// ********** Code for _CanvasRenderingContextImpl **************
// ********** Code for _CanvasRenderingContext2DImpl **************
// ********** Code for _ClientRectImpl **************
// ********** Code for _ClientRectListImpl **************
// ********** Code for _ClipboardImpl **************
// ********** Code for _CloseEventImpl **************
// ********** Code for _CommentImpl **************
// ********** Code for _UIEventImpl **************
// ********** Code for _CompositionEventImpl **************
// ********** Code for _ConsoleImpl **************
_ConsoleImpl = (typeof console == 'undefined' ? {} : console);
// ********** Code for _ContentElementImpl **************
// ********** Code for _ConvolverNodeImpl **************
// ********** Code for _CoordinatesImpl **************
// ********** Code for _CounterImpl **************
// ********** Code for _CryptoImpl **************
// ********** Code for _CustomEventImpl **************
// ********** Code for _DListElementImpl **************
// ********** Code for _DOMApplicationCacheImpl **************
$dynamic("_addEventListener").DOMApplicationCache = function(type, listener, useCapture) {
  this.addEventListener(type, listener, useCapture);
}
// ********** Code for _DOMExceptionImpl **************
// ********** Code for _DOMFileSystemImpl **************
// ********** Code for _DOMFileSystemSyncImpl **************
// ********** Code for _DOMFormDataImpl **************
// ********** Code for _DOMImplementationImpl **************
// ********** Code for _DOMMimeTypeImpl **************
// ********** Code for _DOMMimeTypeArrayImpl **************
// ********** Code for _DOMParserImpl **************
// ********** Code for _DOMPluginImpl **************
// ********** Code for _DOMPluginArrayImpl **************
// ********** Code for _DOMSelectionImpl **************
// ********** Code for _DOMTokenListImpl **************
// ********** Code for _DOMSettableTokenListImpl **************
// ********** Code for _DOMURLImpl **************
// ********** Code for _DataTransferItemImpl **************
// ********** Code for _DataTransferItemListImpl **************
// ********** Code for _DataViewImpl **************
// ********** Code for _DatabaseImpl **************
// ********** Code for _DatabaseSyncImpl **************
// ********** Code for _WorkerContextImpl **************
// ********** Code for _DedicatedWorkerContextImpl **************
// ********** Code for _DelayNodeImpl **************
// ********** Code for _DetailsElementImpl **************
// ********** Code for _DeviceMotionEventImpl **************
// ********** Code for _DeviceOrientationEventImpl **************
// ********** Code for _DirectoryElementImpl **************
// ********** Code for _EntryImpl **************
// ********** Code for _DirectoryEntryImpl **************
// ********** Code for _EntrySyncImpl **************
// ********** Code for _DirectoryEntrySyncImpl **************
// ********** Code for _DirectoryReaderImpl **************
// ********** Code for _DirectoryReaderSyncImpl **************
// ********** Code for _DivElementImpl **************
// ********** Code for _DocumentImpl **************
$dynamic("get$on").HTMLHtmlElement = function() {
  return new _DocumentEventsImpl(this.get$_jsDocument());
}
$dynamic("_createElement").HTMLHtmlElement = function(tagName) {
  return this.parentNode.createElement(tagName);
}
$dynamic("get$_jsDocument").HTMLHtmlElement = function() {
  return this.parentNode;
}
// ********** Code for _SecretHtmlDocumentImpl **************
// ********** Code for _DocumentEventsImpl **************
$inherits(_DocumentEventsImpl, _ElementEventsImpl);
function _DocumentEventsImpl(_ptr) {
  _ElementEventsImpl.call(this, _ptr);
}
_DocumentEventsImpl.prototype.get$touchMove = function() {
  return this._get("touchmove");
}
_DocumentEventsImpl.prototype.get$touchStart = function() {
  return this._get("touchstart");
}
// ********** Code for _DocumentFragmentImpl **************
// ********** Code for _DocumentTypeImpl **************
// ********** Code for _DynamicsCompressorNodeImpl **************
// ********** Code for _SimpleClientRect **************
function _SimpleClientRect(left, top, width, height) {
  this.left = left;
  this.top = top;
  this.width = width;
  this.height = height;
}
_SimpleClientRect.prototype.$eq = function(other) {
  return null != other && this.left == other.left && this.top == other.top && this.width == other.width && this.height == other.height;
}
_SimpleClientRect.prototype.toString = function() {
  return ("(" + this.left + ", " + this.top + ", " + this.width + ", " + this.height + ")");
}
// ********** Code for _ElementRectImpl **************
function _ElementRectImpl(element) {
  this.client = new _SimpleClientRect(element.get$_clientLeft(), element.get$_clientTop(), element.get$_clientWidth(), element.get$_clientHeight());
  this.offset = new _SimpleClientRect(element.get$_offsetLeft(), element.get$_offsetTop(), element.get$_offsetWidth(), element.get$_offsetHeight());
  this.scroll = new _SimpleClientRect(element.get$_scrollLeft(), element.get$_scrollTop(), element.get$_scrollWidth(), element.get$_scrollHeight());
  this._boundingClientRect = element._getBoundingClientRect();
  this._clientRects = element._getClientRects();
}
// ********** Code for _ElementTimeControlImpl **************
// ********** Code for _ElementTraversalImpl **************
// ********** Code for _EmbedElementImpl **************
// ********** Code for _EntityImpl **************
// ********** Code for _EntityReferenceImpl **************
// ********** Code for _EntryArrayImpl **************
// ********** Code for _EntryArraySyncImpl **************
// ********** Code for _ErrorEventImpl **************
// ********** Code for _EventExceptionImpl **************
// ********** Code for _EventSourceImpl **************
$dynamic("_addEventListener").EventSource = function(type, listener, useCapture) {
  this.addEventListener(type, listener, useCapture);
}
// ********** Code for _EventListenerListImpl **************
function _EventListenerListImpl(_ptr, _type) {
  this._ptr = _ptr;
  this._type = _type;
}
_EventListenerListImpl.prototype.add = function(listener, useCapture) {
  this._add(listener, useCapture);
  return this;
}
_EventListenerListImpl.prototype._add = function(listener, useCapture) {
  this._ptr._addEventListener(this._type, listener, useCapture);
}
// ********** Code for _FieldSetElementImpl **************
// ********** Code for _FileImpl **************
// ********** Code for _FileEntryImpl **************
// ********** Code for _FileEntrySyncImpl **************
// ********** Code for _FileErrorImpl **************
// ********** Code for _FileExceptionImpl **************
// ********** Code for _FileListImpl **************
// ********** Code for _FileReaderImpl **************
// ********** Code for _FileReaderSyncImpl **************
// ********** Code for _FileWriterImpl **************
// ********** Code for _FileWriterSyncImpl **************
// ********** Code for _Float32ArrayImpl **************
var _Float32ArrayImpl = {};
$dynamic("is$List").Float32Array = function(){return true};
$dynamic("is$Collection").Float32Array = function(){return true};
$dynamic("get$length").Float32Array = function() { return this.length; };
$dynamic("$index").Float32Array = function(index) {
  return this[index];
}
$dynamic("$setindex").Float32Array = function(index, value) {
  this[index] = value
}
$dynamic("iterator").Float32Array = function() {
  return new _FixedSizeListIterator_num(this);
}
$dynamic("add").Float32Array = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
// ********** Code for _Float64ArrayImpl **************
var _Float64ArrayImpl = {};
$dynamic("is$List").Float64Array = function(){return true};
$dynamic("is$Collection").Float64Array = function(){return true};
$dynamic("get$length").Float64Array = function() { return this.length; };
$dynamic("$index").Float64Array = function(index) {
  return this[index];
}
$dynamic("$setindex").Float64Array = function(index, value) {
  this[index] = value
}
$dynamic("iterator").Float64Array = function() {
  return new _FixedSizeListIterator_num(this);
}
$dynamic("add").Float64Array = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
// ********** Code for _FontElementImpl **************
$dynamic("get$color").HTMLFontElement = function() { return this.color; };
// ********** Code for _FormElementImpl **************
// ********** Code for _FrameElementImpl **************
// ********** Code for _FrameSetElementImpl **************
$dynamic("get$on").HTMLFrameSetElement = function() {
  return new _FrameSetElementEventsImpl(this);
}
// ********** Code for _FrameSetElementEventsImpl **************
$inherits(_FrameSetElementEventsImpl, _ElementEventsImpl);
function _FrameSetElementEventsImpl(_ptr) {
  _ElementEventsImpl.call(this, _ptr);
}
// ********** Code for _GeolocationImpl **************
// ********** Code for _GeopositionImpl **************
// ********** Code for _HRElementImpl **************
// ********** Code for _HTMLAllCollectionImpl **************
// ********** Code for _HTMLCollectionImpl **************
$dynamic("is$List").HTMLCollection = function(){return true};
$dynamic("is$Collection").HTMLCollection = function(){return true};
$dynamic("get$length").HTMLCollection = function() { return this.length; };
$dynamic("$index").HTMLCollection = function(index) {
  return this[index];
}
$dynamic("$setindex").HTMLCollection = function(index, value) {
  $throw(new UnsupportedOperationException("Cannot assign element of immutable List."));
}
$dynamic("iterator").HTMLCollection = function() {
  return new _FixedSizeListIterator_html_Node(this);
}
$dynamic("add").HTMLCollection = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
// ********** Code for _HTMLOptionsCollectionImpl **************
$dynamic("is$List").HTMLOptionsCollection = function(){return true};
$dynamic("is$Collection").HTMLOptionsCollection = function(){return true};
$dynamic("get$length").HTMLOptionsCollection = function() {
  return this.length;
}
// ********** Code for _HashChangeEventImpl **************
// ********** Code for _HeadElementImpl **************
// ********** Code for _HeadingElementImpl **************
// ********** Code for _HighPass2FilterNodeImpl **************
// ********** Code for _HistoryImpl **************
// ********** Code for _HtmlElementImpl **************
// ********** Code for _IDBAnyImpl **************
// ********** Code for _IDBCursorImpl **************
// ********** Code for _IDBCursorWithValueImpl **************
// ********** Code for _IDBDatabaseImpl **************
// ********** Code for _IDBDatabaseErrorImpl **************
// ********** Code for _IDBDatabaseExceptionImpl **************
// ********** Code for _IDBFactoryImpl **************
// ********** Code for _IDBIndexImpl **************
// ********** Code for _IDBKeyImpl **************
// ********** Code for _IDBKeyRangeImpl **************
// ********** Code for _IDBObjectStoreImpl **************
// ********** Code for _IDBRequestImpl **************
// ********** Code for _IDBTransactionImpl **************
// ********** Code for _IDBVersionChangeEventImpl **************
// ********** Code for _IDBVersionChangeRequestImpl **************
// ********** Code for _IFrameElementImpl **************
// ********** Code for _ImageDataImpl **************
// ********** Code for _ImageElementImpl **************
$dynamic("get$x").HTMLImageElement = function() { return this.x; };
$dynamic("get$y").HTMLImageElement = function() { return this.y; };
// ********** Code for _InputElementImpl **************
$dynamic("get$on").HTMLInputElement = function() {
  return new _InputElementEventsImpl(this);
}
// ********** Code for _InputElementEventsImpl **************
$inherits(_InputElementEventsImpl, _ElementEventsImpl);
function _InputElementEventsImpl(_ptr) {
  _ElementEventsImpl.call(this, _ptr);
}
// ********** Code for _Int16ArrayImpl **************
var _Int16ArrayImpl = {};
$dynamic("is$List").Int16Array = function(){return true};
$dynamic("is$Collection").Int16Array = function(){return true};
$dynamic("get$length").Int16Array = function() { return this.length; };
$dynamic("$index").Int16Array = function(index) {
  return this[index];
}
$dynamic("$setindex").Int16Array = function(index, value) {
  this[index] = value
}
$dynamic("iterator").Int16Array = function() {
  return new _FixedSizeListIterator_int(this);
}
$dynamic("add").Int16Array = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
// ********** Code for _Int32ArrayImpl **************
var _Int32ArrayImpl = {};
$dynamic("is$List").Int32Array = function(){return true};
$dynamic("is$Collection").Int32Array = function(){return true};
$dynamic("get$length").Int32Array = function() { return this.length; };
$dynamic("$index").Int32Array = function(index) {
  return this[index];
}
$dynamic("$setindex").Int32Array = function(index, value) {
  this[index] = value
}
$dynamic("iterator").Int32Array = function() {
  return new _FixedSizeListIterator_int(this);
}
$dynamic("add").Int32Array = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
// ********** Code for _Int8ArrayImpl **************
var _Int8ArrayImpl = {};
$dynamic("is$List").Int8Array = function(){return true};
$dynamic("is$Collection").Int8Array = function(){return true};
$dynamic("get$length").Int8Array = function() { return this.length; };
$dynamic("$index").Int8Array = function(index) {
  return this[index];
}
$dynamic("$setindex").Int8Array = function(index, value) {
  this[index] = value
}
$dynamic("iterator").Int8Array = function() {
  return new _FixedSizeListIterator_int(this);
}
$dynamic("add").Int8Array = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
// ********** Code for _JavaScriptAudioNodeImpl **************
// ********** Code for _JavaScriptCallFrameImpl **************
// ********** Code for _KeyboardEventImpl **************
// ********** Code for _KeygenElementImpl **************
// ********** Code for _LIElementImpl **************
// ********** Code for _LabelElementImpl **************
// ********** Code for _LegendElementImpl **************
// ********** Code for _LinkElementImpl **************
// ********** Code for _MediaStreamImpl **************
// ********** Code for _LocalMediaStreamImpl **************
// ********** Code for _LocationImpl **************
// ********** Code for _LowPass2FilterNodeImpl **************
// ********** Code for _MapElementImpl **************
// ********** Code for _MarqueeElementImpl **************
// ********** Code for _MediaControllerImpl **************
// ********** Code for _MediaElementAudioSourceNodeImpl **************
// ********** Code for _MediaErrorImpl **************
// ********** Code for _MediaListImpl **************
$dynamic("is$List").MediaList = function(){return true};
$dynamic("is$Collection").MediaList = function(){return true};
$dynamic("get$length").MediaList = function() { return this.length; };
$dynamic("$index").MediaList = function(index) {
  return this[index];
}
$dynamic("$setindex").MediaList = function(index, value) {
  $throw(new UnsupportedOperationException("Cannot assign element of immutable List."));
}
$dynamic("iterator").MediaList = function() {
  return new _FixedSizeListIterator_dart_core_String(this);
}
$dynamic("add").MediaList = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
// ********** Code for _MediaQueryListImpl **************
// ********** Code for _MediaQueryListListenerImpl **************
// ********** Code for _MediaStreamEventImpl **************
// ********** Code for _MediaStreamListImpl **************
// ********** Code for _MediaStreamTrackImpl **************
// ********** Code for _MediaStreamTrackListImpl **************
// ********** Code for _MemoryInfoImpl **************
// ********** Code for _MenuElementImpl **************
// ********** Code for _MessageChannelImpl **************
// ********** Code for _MessageEventImpl **************
// ********** Code for _MessagePortImpl **************
$dynamic("_addEventListener").MessagePort = function(type, listener, useCapture) {
  this.addEventListener(type, listener, useCapture);
}
// ********** Code for _MetaElementImpl **************
// ********** Code for _MetadataImpl **************
// ********** Code for _MeterElementImpl **************
// ********** Code for _ModElementImpl **************
// ********** Code for _MouseEventImpl **************
$dynamic("get$x").MouseEvent = function() { return this.x; };
$dynamic("get$y").MouseEvent = function() { return this.y; };
// ********** Code for _MutationEventImpl **************
// ********** Code for _NamedNodeMapImpl **************
$dynamic("is$List").NamedNodeMap = function(){return true};
$dynamic("is$Collection").NamedNodeMap = function(){return true};
$dynamic("get$length").NamedNodeMap = function() { return this.length; };
$dynamic("$index").NamedNodeMap = function(index) {
  return this[index];
}
$dynamic("$setindex").NamedNodeMap = function(index, value) {
  $throw(new UnsupportedOperationException("Cannot assign element of immutable List."));
}
$dynamic("iterator").NamedNodeMap = function() {
  return new _FixedSizeListIterator_html_Node(this);
}
$dynamic("add").NamedNodeMap = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
// ********** Code for _NavigatorImpl **************
// ********** Code for _NavigatorUserMediaErrorImpl **************
// ********** Code for _NodeFilterImpl **************
// ********** Code for _NodeIteratorImpl **************
// ********** Code for _ListWrapper **************
function _ListWrapper() {}
_ListWrapper.prototype.is$List = function(){return true};
_ListWrapper.prototype.is$Collection = function(){return true};
_ListWrapper.prototype.iterator = function() {
  return this._html_list.iterator();
}
_ListWrapper.prototype.get$length = function() {
  return this._html_list.get$length();
}
_ListWrapper.prototype.$index = function(index) {
  return this._html_list.$index(index);
}
_ListWrapper.prototype.$setindex = function(index, value) {
  this._html_list.$setindex(index, value);
}
_ListWrapper.prototype.add = function(value) {
  return this._html_list.add(value);
}
_ListWrapper.prototype.clear = function() {
  return this._html_list.clear();
}
_ListWrapper.prototype.removeLast = function() {
  return this._html_list.removeLast();
}
// ********** Code for _NodeListImpl **************
$dynamic("is$List").NodeList = function(){return true};
$dynamic("is$Collection").NodeList = function(){return true};
$dynamic("iterator").NodeList = function() {
  return new _FixedSizeListIterator_html_Node(this);
}
$dynamic("add").NodeList = function(value) {
  this._parent._appendChild(value);
}
$dynamic("removeLast").NodeList = function() {
  var last = this.last();
  if ($ne$(last)) {
    this._parent._removeChild(last);
  }
  return last;
}
$dynamic("clear").NodeList = function() {
  this._parent.set$text("");
}
$dynamic("$setindex").NodeList = function(index, value) {
  this._parent._replaceChild(value, this.$index(index));
}
$dynamic("last").NodeList = function() {
  return this.$index(this.length - (1));
}
$dynamic("get$length").NodeList = function() { return this.length; };
$dynamic("$index").NodeList = function(index) {
  return this[index];
}
// ********** Code for _NodeSelectorImpl **************
// ********** Code for _NotationImpl **************
// ********** Code for _NotificationImpl **************
// ********** Code for _NotificationCenterImpl **************
// ********** Code for _OESStandardDerivativesImpl **************
// ********** Code for _OESTextureFloatImpl **************
// ********** Code for _OESVertexArrayObjectImpl **************
// ********** Code for _OListElementImpl **************
// ********** Code for _ObjectElementImpl **************
// ********** Code for _OfflineAudioCompletionEventImpl **************
// ********** Code for _OperationNotAllowedExceptionImpl **************
// ********** Code for _OptGroupElementImpl **************
// ********** Code for _OptionElementImpl **************
// ********** Code for _OutputElementImpl **************
// ********** Code for _OverflowEventImpl **************
// ********** Code for _PageTransitionEventImpl **************
// ********** Code for _ParagraphElementImpl **************
// ********** Code for _ParamElementImpl **************
// ********** Code for _PeerConnectionImpl **************
// ********** Code for _PerformanceImpl **************
// ********** Code for _PerformanceNavigationImpl **************
// ********** Code for _PerformanceTimingImpl **************
// ********** Code for _PointImpl **************
$dynamic("get$x").WebKitPoint = function() { return this.x; };
$dynamic("set$x").WebKitPoint = function(value) { return this.x = value; };
$dynamic("get$y").WebKitPoint = function() { return this.y; };
$dynamic("set$y").WebKitPoint = function(value) { return this.y = value; };
// ********** Code for _PopStateEventImpl **************
// ********** Code for _PositionErrorImpl **************
// ********** Code for _PreElementImpl **************
// ********** Code for _ProcessingInstructionImpl **************
// ********** Code for _ProgressElementImpl **************
// ********** Code for _ProgressEventImpl **************
// ********** Code for _QuoteElementImpl **************
// ********** Code for _RGBColorImpl **************
// ********** Code for _RangeImpl **************
// ********** Code for _RangeExceptionImpl **************
// ********** Code for _RealtimeAnalyserNodeImpl **************
// ********** Code for _RectImpl **************
// ********** Code for _SQLErrorImpl **************
// ********** Code for _SQLExceptionImpl **************
// ********** Code for _SQLResultSetImpl **************
// ********** Code for _SQLResultSetRowListImpl **************
// ********** Code for _SQLTransactionImpl **************
// ********** Code for _SQLTransactionSyncImpl **************
// ********** Code for _SVGElementImpl **************
// ********** Code for _SVGAElementImpl **************
// ********** Code for _SVGAltGlyphDefElementImpl **************
// ********** Code for _SVGTextContentElementImpl **************
// ********** Code for _SVGTextPositioningElementImpl **************
$dynamic("get$x").SVGTextPositioningElement = function() { return this.x; };
$dynamic("get$y").SVGTextPositioningElement = function() { return this.y; };
// ********** Code for _SVGAltGlyphElementImpl **************
// ********** Code for _SVGAltGlyphItemElementImpl **************
// ********** Code for _SVGAngleImpl **************
// ********** Code for _SVGAnimationElementImpl **************
// ********** Code for _SVGAnimateColorElementImpl **************
// ********** Code for _SVGAnimateElementImpl **************
// ********** Code for _SVGAnimateMotionElementImpl **************
// ********** Code for _SVGAnimateTransformElementImpl **************
// ********** Code for _SVGAnimatedAngleImpl **************
// ********** Code for _SVGAnimatedBooleanImpl **************
// ********** Code for _SVGAnimatedEnumerationImpl **************
// ********** Code for _SVGAnimatedIntegerImpl **************
// ********** Code for _SVGAnimatedLengthImpl **************
// ********** Code for _SVGAnimatedLengthListImpl **************
// ********** Code for _SVGAnimatedNumberImpl **************
// ********** Code for _SVGAnimatedNumberListImpl **************
// ********** Code for _SVGAnimatedPreserveAspectRatioImpl **************
// ********** Code for _SVGAnimatedRectImpl **************
// ********** Code for _SVGAnimatedStringImpl **************
// ********** Code for _SVGAnimatedTransformListImpl **************
// ********** Code for _SVGCircleElementImpl **************
// ********** Code for _SVGClipPathElementImpl **************
// ********** Code for _SVGColorImpl **************
// ********** Code for _SVGComponentTransferFunctionElementImpl **************
// ********** Code for _SVGCursorElementImpl **************
$dynamic("get$x").SVGCursorElement = function() { return this.x; };
$dynamic("get$y").SVGCursorElement = function() { return this.y; };
// ********** Code for _SVGDefsElementImpl **************
// ********** Code for _SVGDescElementImpl **************
// ********** Code for _SVGDocumentImpl **************
// ********** Code for _SVGElementInstanceImpl **************
$dynamic("_addEventListener").SVGElementInstance = function(type, listener, useCapture) {
  this.addEventListener(type, listener, useCapture);
}
// ********** Code for _SVGElementInstanceListImpl **************
// ********** Code for _SVGEllipseElementImpl **************
// ********** Code for _SVGExceptionImpl **************
// ********** Code for _SVGExternalResourcesRequiredImpl **************
// ********** Code for _SVGFEBlendElementImpl **************
$dynamic("get$x").SVGFEBlendElement = function() { return this.x; };
$dynamic("get$y").SVGFEBlendElement = function() { return this.y; };
// ********** Code for _SVGFEColorMatrixElementImpl **************
$dynamic("get$x").SVGFEColorMatrixElement = function() { return this.x; };
$dynamic("get$y").SVGFEColorMatrixElement = function() { return this.y; };
// ********** Code for _SVGFEComponentTransferElementImpl **************
$dynamic("get$x").SVGFEComponentTransferElement = function() { return this.x; };
$dynamic("get$y").SVGFEComponentTransferElement = function() { return this.y; };
// ********** Code for _SVGFECompositeElementImpl **************
$dynamic("get$x").SVGFECompositeElement = function() { return this.x; };
$dynamic("get$y").SVGFECompositeElement = function() { return this.y; };
// ********** Code for _SVGFEConvolveMatrixElementImpl **************
$dynamic("get$x").SVGFEConvolveMatrixElement = function() { return this.x; };
$dynamic("get$y").SVGFEConvolveMatrixElement = function() { return this.y; };
// ********** Code for _SVGFEDiffuseLightingElementImpl **************
$dynamic("get$x").SVGFEDiffuseLightingElement = function() { return this.x; };
$dynamic("get$y").SVGFEDiffuseLightingElement = function() { return this.y; };
// ********** Code for _SVGFEDisplacementMapElementImpl **************
$dynamic("get$x").SVGFEDisplacementMapElement = function() { return this.x; };
$dynamic("get$y").SVGFEDisplacementMapElement = function() { return this.y; };
// ********** Code for _SVGFEDistantLightElementImpl **************
// ********** Code for _SVGFEDropShadowElementImpl **************
$dynamic("get$x").SVGFEDropShadowElement = function() { return this.x; };
$dynamic("get$y").SVGFEDropShadowElement = function() { return this.y; };
// ********** Code for _SVGFEFloodElementImpl **************
$dynamic("get$x").SVGFEFloodElement = function() { return this.x; };
$dynamic("get$y").SVGFEFloodElement = function() { return this.y; };
// ********** Code for _SVGFEFuncAElementImpl **************
// ********** Code for _SVGFEFuncBElementImpl **************
// ********** Code for _SVGFEFuncGElementImpl **************
// ********** Code for _SVGFEFuncRElementImpl **************
// ********** Code for _SVGFEGaussianBlurElementImpl **************
$dynamic("get$x").SVGFEGaussianBlurElement = function() { return this.x; };
$dynamic("get$y").SVGFEGaussianBlurElement = function() { return this.y; };
// ********** Code for _SVGFEImageElementImpl **************
$dynamic("get$x").SVGFEImageElement = function() { return this.x; };
$dynamic("get$y").SVGFEImageElement = function() { return this.y; };
// ********** Code for _SVGFEMergeElementImpl **************
$dynamic("get$x").SVGFEMergeElement = function() { return this.x; };
$dynamic("get$y").SVGFEMergeElement = function() { return this.y; };
// ********** Code for _SVGFEMergeNodeElementImpl **************
// ********** Code for _SVGFEMorphologyElementImpl **************
$dynamic("get$x").SVGFEMorphologyElement = function() { return this.x; };
$dynamic("get$y").SVGFEMorphologyElement = function() { return this.y; };
// ********** Code for _SVGFEOffsetElementImpl **************
$dynamic("get$x").SVGFEOffsetElement = function() { return this.x; };
$dynamic("get$y").SVGFEOffsetElement = function() { return this.y; };
// ********** Code for _SVGFEPointLightElementImpl **************
$dynamic("get$x").SVGFEPointLightElement = function() { return this.x; };
$dynamic("get$y").SVGFEPointLightElement = function() { return this.y; };
// ********** Code for _SVGFESpecularLightingElementImpl **************
$dynamic("get$x").SVGFESpecularLightingElement = function() { return this.x; };
$dynamic("get$y").SVGFESpecularLightingElement = function() { return this.y; };
// ********** Code for _SVGFESpotLightElementImpl **************
$dynamic("get$x").SVGFESpotLightElement = function() { return this.x; };
$dynamic("get$y").SVGFESpotLightElement = function() { return this.y; };
// ********** Code for _SVGFETileElementImpl **************
$dynamic("get$x").SVGFETileElement = function() { return this.x; };
$dynamic("get$y").SVGFETileElement = function() { return this.y; };
// ********** Code for _SVGFETurbulenceElementImpl **************
$dynamic("get$x").SVGFETurbulenceElement = function() { return this.x; };
$dynamic("get$y").SVGFETurbulenceElement = function() { return this.y; };
// ********** Code for _SVGFilterElementImpl **************
$dynamic("get$x").SVGFilterElement = function() { return this.x; };
$dynamic("get$y").SVGFilterElement = function() { return this.y; };
// ********** Code for _SVGStylableImpl **************
// ********** Code for _SVGFilterPrimitiveStandardAttributesImpl **************
$dynamic("get$x").SVGFilterPrimitiveStandardAttributes = function() { return this.x; };
$dynamic("get$y").SVGFilterPrimitiveStandardAttributes = function() { return this.y; };
// ********** Code for _SVGFitToViewBoxImpl **************
// ********** Code for _SVGFontElementImpl **************
// ********** Code for _SVGFontFaceElementImpl **************
// ********** Code for _SVGFontFaceFormatElementImpl **************
// ********** Code for _SVGFontFaceNameElementImpl **************
// ********** Code for _SVGFontFaceSrcElementImpl **************
// ********** Code for _SVGFontFaceUriElementImpl **************
// ********** Code for _SVGForeignObjectElementImpl **************
$dynamic("get$x").SVGForeignObjectElement = function() { return this.x; };
$dynamic("get$y").SVGForeignObjectElement = function() { return this.y; };
// ********** Code for _SVGGElementImpl **************
// ********** Code for _SVGGlyphElementImpl **************
// ********** Code for _SVGGlyphRefElementImpl **************
$dynamic("get$x").SVGGlyphRefElement = function() { return this.x; };
$dynamic("set$x").SVGGlyphRefElement = function(value) { return this.x = value; };
$dynamic("get$y").SVGGlyphRefElement = function() { return this.y; };
$dynamic("set$y").SVGGlyphRefElement = function(value) { return this.y = value; };
// ********** Code for _SVGGradientElementImpl **************
// ********** Code for _SVGHKernElementImpl **************
// ********** Code for _SVGImageElementImpl **************
$dynamic("get$x").SVGImageElement = function() { return this.x; };
$dynamic("get$y").SVGImageElement = function() { return this.y; };
// ********** Code for _SVGLangSpaceImpl **************
// ********** Code for _SVGLengthImpl **************
// ********** Code for _SVGLengthListImpl **************
// ********** Code for _SVGLineElementImpl **************
// ********** Code for _SVGLinearGradientElementImpl **************
// ********** Code for _SVGLocatableImpl **************
// ********** Code for _SVGMPathElementImpl **************
// ********** Code for _SVGMarkerElementImpl **************
// ********** Code for _SVGMaskElementImpl **************
$dynamic("get$x").SVGMaskElement = function() { return this.x; };
$dynamic("get$y").SVGMaskElement = function() { return this.y; };
// ********** Code for _SVGMatrixImpl **************
// ********** Code for _SVGMetadataElementImpl **************
// ********** Code for _SVGMissingGlyphElementImpl **************
// ********** Code for _SVGNumberImpl **************
// ********** Code for _SVGNumberListImpl **************
// ********** Code for _SVGPaintImpl **************
// ********** Code for _SVGPathElementImpl **************
// ********** Code for _SVGPathSegImpl **************
// ********** Code for _SVGPathSegArcAbsImpl **************
$dynamic("get$x").SVGPathSegArcAbs = function() { return this.x; };
$dynamic("set$x").SVGPathSegArcAbs = function(value) { return this.x = value; };
$dynamic("get$y").SVGPathSegArcAbs = function() { return this.y; };
$dynamic("set$y").SVGPathSegArcAbs = function(value) { return this.y = value; };
// ********** Code for _SVGPathSegArcRelImpl **************
$dynamic("get$x").SVGPathSegArcRel = function() { return this.x; };
$dynamic("set$x").SVGPathSegArcRel = function(value) { return this.x = value; };
$dynamic("get$y").SVGPathSegArcRel = function() { return this.y; };
$dynamic("set$y").SVGPathSegArcRel = function(value) { return this.y = value; };
// ********** Code for _SVGPathSegClosePathImpl **************
// ********** Code for _SVGPathSegCurvetoCubicAbsImpl **************
$dynamic("get$x").SVGPathSegCurvetoCubicAbs = function() { return this.x; };
$dynamic("set$x").SVGPathSegCurvetoCubicAbs = function(value) { return this.x = value; };
$dynamic("get$y").SVGPathSegCurvetoCubicAbs = function() { return this.y; };
$dynamic("set$y").SVGPathSegCurvetoCubicAbs = function(value) { return this.y = value; };
// ********** Code for _SVGPathSegCurvetoCubicRelImpl **************
$dynamic("get$x").SVGPathSegCurvetoCubicRel = function() { return this.x; };
$dynamic("set$x").SVGPathSegCurvetoCubicRel = function(value) { return this.x = value; };
$dynamic("get$y").SVGPathSegCurvetoCubicRel = function() { return this.y; };
$dynamic("set$y").SVGPathSegCurvetoCubicRel = function(value) { return this.y = value; };
// ********** Code for _SVGPathSegCurvetoCubicSmoothAbsImpl **************
$dynamic("get$x").SVGPathSegCurvetoCubicSmoothAbs = function() { return this.x; };
$dynamic("set$x").SVGPathSegCurvetoCubicSmoothAbs = function(value) { return this.x = value; };
$dynamic("get$y").SVGPathSegCurvetoCubicSmoothAbs = function() { return this.y; };
$dynamic("set$y").SVGPathSegCurvetoCubicSmoothAbs = function(value) { return this.y = value; };
// ********** Code for _SVGPathSegCurvetoCubicSmoothRelImpl **************
$dynamic("get$x").SVGPathSegCurvetoCubicSmoothRel = function() { return this.x; };
$dynamic("set$x").SVGPathSegCurvetoCubicSmoothRel = function(value) { return this.x = value; };
$dynamic("get$y").SVGPathSegCurvetoCubicSmoothRel = function() { return this.y; };
$dynamic("set$y").SVGPathSegCurvetoCubicSmoothRel = function(value) { return this.y = value; };
// ********** Code for _SVGPathSegCurvetoQuadraticAbsImpl **************
$dynamic("get$x").SVGPathSegCurvetoQuadraticAbs = function() { return this.x; };
$dynamic("set$x").SVGPathSegCurvetoQuadraticAbs = function(value) { return this.x = value; };
$dynamic("get$y").SVGPathSegCurvetoQuadraticAbs = function() { return this.y; };
$dynamic("set$y").SVGPathSegCurvetoQuadraticAbs = function(value) { return this.y = value; };
// ********** Code for _SVGPathSegCurvetoQuadraticRelImpl **************
$dynamic("get$x").SVGPathSegCurvetoQuadraticRel = function() { return this.x; };
$dynamic("set$x").SVGPathSegCurvetoQuadraticRel = function(value) { return this.x = value; };
$dynamic("get$y").SVGPathSegCurvetoQuadraticRel = function() { return this.y; };
$dynamic("set$y").SVGPathSegCurvetoQuadraticRel = function(value) { return this.y = value; };
// ********** Code for _SVGPathSegCurvetoQuadraticSmoothAbsImpl **************
$dynamic("get$x").SVGPathSegCurvetoQuadraticSmoothAbs = function() { return this.x; };
$dynamic("set$x").SVGPathSegCurvetoQuadraticSmoothAbs = function(value) { return this.x = value; };
$dynamic("get$y").SVGPathSegCurvetoQuadraticSmoothAbs = function() { return this.y; };
$dynamic("set$y").SVGPathSegCurvetoQuadraticSmoothAbs = function(value) { return this.y = value; };
// ********** Code for _SVGPathSegCurvetoQuadraticSmoothRelImpl **************
$dynamic("get$x").SVGPathSegCurvetoQuadraticSmoothRel = function() { return this.x; };
$dynamic("set$x").SVGPathSegCurvetoQuadraticSmoothRel = function(value) { return this.x = value; };
$dynamic("get$y").SVGPathSegCurvetoQuadraticSmoothRel = function() { return this.y; };
$dynamic("set$y").SVGPathSegCurvetoQuadraticSmoothRel = function(value) { return this.y = value; };
// ********** Code for _SVGPathSegLinetoAbsImpl **************
$dynamic("get$x").SVGPathSegLinetoAbs = function() { return this.x; };
$dynamic("set$x").SVGPathSegLinetoAbs = function(value) { return this.x = value; };
$dynamic("get$y").SVGPathSegLinetoAbs = function() { return this.y; };
$dynamic("set$y").SVGPathSegLinetoAbs = function(value) { return this.y = value; };
// ********** Code for _SVGPathSegLinetoHorizontalAbsImpl **************
$dynamic("get$x").SVGPathSegLinetoHorizontalAbs = function() { return this.x; };
$dynamic("set$x").SVGPathSegLinetoHorizontalAbs = function(value) { return this.x = value; };
// ********** Code for _SVGPathSegLinetoHorizontalRelImpl **************
$dynamic("get$x").SVGPathSegLinetoHorizontalRel = function() { return this.x; };
$dynamic("set$x").SVGPathSegLinetoHorizontalRel = function(value) { return this.x = value; };
// ********** Code for _SVGPathSegLinetoRelImpl **************
$dynamic("get$x").SVGPathSegLinetoRel = function() { return this.x; };
$dynamic("set$x").SVGPathSegLinetoRel = function(value) { return this.x = value; };
$dynamic("get$y").SVGPathSegLinetoRel = function() { return this.y; };
$dynamic("set$y").SVGPathSegLinetoRel = function(value) { return this.y = value; };
// ********** Code for _SVGPathSegLinetoVerticalAbsImpl **************
$dynamic("get$y").SVGPathSegLinetoVerticalAbs = function() { return this.y; };
$dynamic("set$y").SVGPathSegLinetoVerticalAbs = function(value) { return this.y = value; };
// ********** Code for _SVGPathSegLinetoVerticalRelImpl **************
$dynamic("get$y").SVGPathSegLinetoVerticalRel = function() { return this.y; };
$dynamic("set$y").SVGPathSegLinetoVerticalRel = function(value) { return this.y = value; };
// ********** Code for _SVGPathSegListImpl **************
// ********** Code for _SVGPathSegMovetoAbsImpl **************
$dynamic("get$x").SVGPathSegMovetoAbs = function() { return this.x; };
$dynamic("set$x").SVGPathSegMovetoAbs = function(value) { return this.x = value; };
$dynamic("get$y").SVGPathSegMovetoAbs = function() { return this.y; };
$dynamic("set$y").SVGPathSegMovetoAbs = function(value) { return this.y = value; };
// ********** Code for _SVGPathSegMovetoRelImpl **************
$dynamic("get$x").SVGPathSegMovetoRel = function() { return this.x; };
$dynamic("set$x").SVGPathSegMovetoRel = function(value) { return this.x = value; };
$dynamic("get$y").SVGPathSegMovetoRel = function() { return this.y; };
$dynamic("set$y").SVGPathSegMovetoRel = function(value) { return this.y = value; };
// ********** Code for _SVGPatternElementImpl **************
$dynamic("get$x").SVGPatternElement = function() { return this.x; };
$dynamic("get$y").SVGPatternElement = function() { return this.y; };
// ********** Code for _SVGPointImpl **************
$dynamic("get$x").SVGPoint = function() { return this.x; };
$dynamic("set$x").SVGPoint = function(value) { return this.x = value; };
$dynamic("get$y").SVGPoint = function() { return this.y; };
$dynamic("set$y").SVGPoint = function(value) { return this.y = value; };
// ********** Code for _SVGPointListImpl **************
// ********** Code for _SVGPolygonElementImpl **************
// ********** Code for _SVGPolylineElementImpl **************
// ********** Code for _SVGPreserveAspectRatioImpl **************
// ********** Code for _SVGRadialGradientElementImpl **************
// ********** Code for _SVGRectImpl **************
$dynamic("get$x").SVGRect = function() { return this.x; };
$dynamic("set$x").SVGRect = function(value) { return this.x = value; };
$dynamic("get$y").SVGRect = function() { return this.y; };
$dynamic("set$y").SVGRect = function(value) { return this.y = value; };
// ********** Code for _SVGRectElementImpl **************
$dynamic("get$x").SVGRectElement = function() { return this.x; };
$dynamic("get$y").SVGRectElement = function() { return this.y; };
// ********** Code for _SVGRenderingIntentImpl **************
// ********** Code for _SVGSVGElementImpl **************
$dynamic("get$x").SVGSVGElement = function() { return this.x; };
$dynamic("get$y").SVGSVGElement = function() { return this.y; };
// ********** Code for _SVGScriptElementImpl **************
// ********** Code for _SVGSetElementImpl **************
// ********** Code for _SVGStopElementImpl **************
// ********** Code for _SVGStringListImpl **************
// ********** Code for _SVGStyleElementImpl **************
// ********** Code for _SVGSwitchElementImpl **************
// ********** Code for _SVGSymbolElementImpl **************
// ********** Code for _SVGTRefElementImpl **************
// ********** Code for _SVGTSpanElementImpl **************
// ********** Code for _SVGTestsImpl **************
// ********** Code for _SVGTextElementImpl **************
// ********** Code for _SVGTextPathElementImpl **************
// ********** Code for _SVGTitleElementImpl **************
// ********** Code for _SVGTransformImpl **************
// ********** Code for _SVGTransformListImpl **************
// ********** Code for _SVGTransformableImpl **************
// ********** Code for _SVGURIReferenceImpl **************
// ********** Code for _SVGUnitTypesImpl **************
// ********** Code for _SVGUseElementImpl **************
$dynamic("get$x").SVGUseElement = function() { return this.x; };
$dynamic("get$y").SVGUseElement = function() { return this.y; };
// ********** Code for _SVGVKernElementImpl **************
// ********** Code for _SVGViewElementImpl **************
// ********** Code for _SVGZoomAndPanImpl **************
// ********** Code for _SVGViewSpecImpl **************
// ********** Code for _SVGZoomEventImpl **************
// ********** Code for _ScreenImpl **************
// ********** Code for _ScriptElementImpl **************
// ********** Code for _ScriptProfileImpl **************
// ********** Code for _ScriptProfileNodeImpl **************
// ********** Code for _SelectElementImpl **************
// ********** Code for _ShadowElementImpl **************
// ********** Code for _ShadowRootImpl **************
$dynamic("set$innerHTML").ShadowRoot = function(value) { return this.innerHTML = value; };
// ********** Code for _SharedWorkerImpl **************
// ********** Code for _SharedWorkerContextImpl **************
// ********** Code for _SourceElementImpl **************
// ********** Code for _SpanElementImpl **************
// ********** Code for _SpeechInputEventImpl **************
// ********** Code for _SpeechInputResultImpl **************
// ********** Code for _SpeechInputResultListImpl **************
// ********** Code for _StorageImpl **************
// ********** Code for _StorageEventImpl **************
// ********** Code for _StorageInfoImpl **************
// ********** Code for _StyleElementImpl **************
// ********** Code for _StyleMediaImpl **************
// ********** Code for _StyleSheetListImpl **************
$dynamic("is$List").StyleSheetList = function(){return true};
$dynamic("is$Collection").StyleSheetList = function(){return true};
$dynamic("get$length").StyleSheetList = function() { return this.length; };
$dynamic("$index").StyleSheetList = function(index) {
  return this[index];
}
$dynamic("$setindex").StyleSheetList = function(index, value) {
  $throw(new UnsupportedOperationException("Cannot assign element of immutable List."));
}
$dynamic("iterator").StyleSheetList = function() {
  return new _FixedSizeListIterator_html_StyleSheet(this);
}
$dynamic("add").StyleSheetList = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
// ********** Code for _TableCaptionElementImpl **************
// ********** Code for _TableCellElementImpl **************
// ********** Code for _TableColElementImpl **************
// ********** Code for _TableElementImpl **************
// ********** Code for _TableRowElementImpl **************
// ********** Code for _TableSectionElementImpl **************
// ********** Code for _TextAreaElementImpl **************
// ********** Code for _TextEventImpl **************
// ********** Code for _TextMetricsImpl **************
// ********** Code for _TextTrackImpl **************
// ********** Code for _TextTrackCueImpl **************
$dynamic("get$text").TextTrackCue = function() { return this.text; };
// ********** Code for _TextTrackCueListImpl **************
// ********** Code for _TextTrackListImpl **************
// ********** Code for _TimeRangesImpl **************
// ********** Code for _TitleElementImpl **************
// ********** Code for _TouchImpl **************
// ********** Code for _TouchEventImpl **************
// ********** Code for _TouchListImpl **************
$dynamic("is$List").TouchList = function(){return true};
$dynamic("is$Collection").TouchList = function(){return true};
$dynamic("get$length").TouchList = function() { return this.length; };
$dynamic("$index").TouchList = function(index) {
  return this[index];
}
$dynamic("$setindex").TouchList = function(index, value) {
  $throw(new UnsupportedOperationException("Cannot assign element of immutable List."));
}
$dynamic("iterator").TouchList = function() {
  return new _FixedSizeListIterator_html_Touch(this);
}
$dynamic("add").TouchList = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("forEach").TouchList = function(f) {
  return _Collections.forEach(this, f);
}
// ********** Code for _TrackElementImpl **************
// ********** Code for _TrackEventImpl **************
// ********** Code for _TransitionEventImpl **************
// ********** Code for _TreeWalkerImpl **************
// ********** Code for _UListElementImpl **************
// ********** Code for _Uint16ArrayImpl **************
var _Uint16ArrayImpl = {};
$dynamic("is$List").Uint16Array = function(){return true};
$dynamic("is$Collection").Uint16Array = function(){return true};
$dynamic("get$length").Uint16Array = function() { return this.length; };
$dynamic("$index").Uint16Array = function(index) {
  return this[index];
}
$dynamic("$setindex").Uint16Array = function(index, value) {
  this[index] = value
}
$dynamic("iterator").Uint16Array = function() {
  return new _FixedSizeListIterator_int(this);
}
$dynamic("add").Uint16Array = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
// ********** Code for _Uint32ArrayImpl **************
var _Uint32ArrayImpl = {};
$dynamic("is$List").Uint32Array = function(){return true};
$dynamic("is$Collection").Uint32Array = function(){return true};
$dynamic("get$length").Uint32Array = function() { return this.length; };
$dynamic("$index").Uint32Array = function(index) {
  return this[index];
}
$dynamic("$setindex").Uint32Array = function(index, value) {
  this[index] = value
}
$dynamic("iterator").Uint32Array = function() {
  return new _FixedSizeListIterator_int(this);
}
$dynamic("add").Uint32Array = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
// ********** Code for _Uint8ArrayImpl **************
var _Uint8ArrayImpl = {};
$dynamic("is$List").Uint8Array = function(){return true};
$dynamic("is$Collection").Uint8Array = function(){return true};
$dynamic("get$length").Uint8Array = function() { return this.length; };
$dynamic("$index").Uint8Array = function(index) {
  return this[index];
}
$dynamic("$setindex").Uint8Array = function(index, value) {
  this[index] = value
}
$dynamic("iterator").Uint8Array = function() {
  return new _FixedSizeListIterator_int(this);
}
$dynamic("add").Uint8Array = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
// ********** Code for _Uint8ClampedArrayImpl **************
var _Uint8ClampedArrayImpl = {};
$dynamic("is$List").Uint8ClampedArray = function(){return true};
$dynamic("is$Collection").Uint8ClampedArray = function(){return true};
// ********** Code for _UnknownElementImpl **************
// ********** Code for _ValidityStateImpl **************
// ********** Code for _VideoElementImpl **************
// ********** Code for _WaveShaperNodeImpl **************
// ********** Code for _WebGLActiveInfoImpl **************
// ********** Code for _WebGLBufferImpl **************
// ********** Code for _WebGLCompressedTextureS3TCImpl **************
// ********** Code for _WebGLContextAttributesImpl **************
// ********** Code for _WebGLContextEventImpl **************
// ********** Code for _WebGLDebugRendererInfoImpl **************
// ********** Code for _WebGLDebugShadersImpl **************
// ********** Code for _WebGLFramebufferImpl **************
// ********** Code for _WebGLLoseContextImpl **************
// ********** Code for _WebGLProgramImpl **************
// ********** Code for _WebGLRenderbufferImpl **************
// ********** Code for _WebGLRenderingContextImpl **************
// ********** Code for _WebGLShaderImpl **************
// ********** Code for _WebGLTextureImpl **************
// ********** Code for _WebGLUniformLocationImpl **************
// ********** Code for _WebGLVertexArrayObjectOESImpl **************
// ********** Code for _WebKitCSSRegionRuleImpl **************
// ********** Code for _WebKitNamedFlowImpl **************
// ********** Code for _WebSocketImpl **************
$dynamic("_addEventListener").WebSocket = function(type, listener, useCapture) {
  this.addEventListener(type, listener, useCapture);
}
// ********** Code for _WheelEventImpl **************
$dynamic("get$x").WheelEvent = function() { return this.x; };
$dynamic("get$y").WheelEvent = function() { return this.y; };
// ********** Code for _WindowImpl **************
$dynamic("get$on").DOMWindow = function() {
  return new _WindowEventsImpl(this);
}
$dynamic("_addEventListener").DOMWindow = function(type, listener, useCapture) {
  this.addEventListener(type, listener, useCapture);
}
// ********** Code for _WindowEventsImpl **************
$inherits(_WindowEventsImpl, _EventsImpl);
function _WindowEventsImpl(_ptr) {
  _EventsImpl.call(this, _ptr);
}
_WindowEventsImpl.prototype.get$message = function() {
  return this._get("message");
}
_WindowEventsImpl.prototype.get$touchMove = function() {
  return this._get("touchmove");
}
_WindowEventsImpl.prototype.get$touchStart = function() {
  return this._get("touchstart");
}
// ********** Code for _WorkerImpl **************
// ********** Code for _WorkerLocationImpl **************
// ********** Code for _WorkerNavigatorImpl **************
// ********** Code for _XMLHttpRequestImpl **************
$dynamic("_addEventListener").XMLHttpRequest = function(type, listener, useCapture) {
  this.addEventListener(type, listener, useCapture);
}
// ********** Code for _XMLHttpRequestExceptionImpl **************
// ********** Code for _XMLHttpRequestProgressEventImpl **************
// ********** Code for _XMLHttpRequestUploadImpl **************
$dynamic("_addEventListener").XMLHttpRequestUpload = function(type, listener, useCapture) {
  this.addEventListener(type, listener, useCapture);
}
// ********** Code for _XMLSerializerImpl **************
// ********** Code for _XPathEvaluatorImpl **************
// ********** Code for _XPathExceptionImpl **************
// ********** Code for _XPathExpressionImpl **************
// ********** Code for _XPathNSResolverImpl **************
// ********** Code for _XPathResultImpl **************
// ********** Code for _XSLTProcessorImpl **************
// ********** Code for _Collections **************
function _Collections() {}
_Collections.forEach = function(iterable, f) {
  for (var $$i = iterable.iterator(); $$i.hasNext(); ) {
    var e = $$i.next();
    f(e);
  }
}
// ********** Code for _MeasurementRequest **************
function _MeasurementRequest(computeValue, completer) {
  this.computeValue = computeValue;
  this.completer = completer;
  this.exception = false;
}
// ********** Code for _ElementFactoryProvider **************
function _ElementFactoryProvider() {}
_ElementFactoryProvider.Element$tag$factory = function(tag) {
  return get$$document()._createElement(tag);
}
// ********** Code for _VariableSizeListIterator **************
function _VariableSizeListIterator() {}
_VariableSizeListIterator.prototype.hasNext = function() {
  return this._html_array.get$length() > this._html_pos;
}
_VariableSizeListIterator.prototype.next = function() {
  if (!this.hasNext()) {
    $throw(const$0001);
  }
  return this._html_array.$index(this._html_pos++);
}
// ********** Code for _FixedSizeListIterator **************
$inherits(_FixedSizeListIterator, _VariableSizeListIterator);
function _FixedSizeListIterator() {}
_FixedSizeListIterator.prototype.hasNext = function() {
  return this._html_length > this._html_pos;
}
// ********** Code for _VariableSizeListIterator_dart_core_String **************
$inherits(_VariableSizeListIterator_dart_core_String, _VariableSizeListIterator);
function _VariableSizeListIterator_dart_core_String(array) {
  this._html_array = array;
  this._html_pos = (0);
}
// ********** Code for _FixedSizeListIterator_dart_core_String **************
$inherits(_FixedSizeListIterator_dart_core_String, _FixedSizeListIterator);
function _FixedSizeListIterator_dart_core_String(array) {
  this._html_length = array.get$length();
  _VariableSizeListIterator_dart_core_String.call(this, array);
}
// ********** Code for _VariableSizeListIterator_int **************
$inherits(_VariableSizeListIterator_int, _VariableSizeListIterator);
function _VariableSizeListIterator_int(array) {
  this._html_array = array;
  this._html_pos = (0);
}
// ********** Code for _FixedSizeListIterator_int **************
$inherits(_FixedSizeListIterator_int, _FixedSizeListIterator);
function _FixedSizeListIterator_int(array) {
  this._html_length = array.get$length();
  _VariableSizeListIterator_int.call(this, array);
}
// ********** Code for _VariableSizeListIterator_num **************
$inherits(_VariableSizeListIterator_num, _VariableSizeListIterator);
function _VariableSizeListIterator_num(array) {
  this._html_array = array;
  this._html_pos = (0);
}
// ********** Code for _FixedSizeListIterator_num **************
$inherits(_FixedSizeListIterator_num, _FixedSizeListIterator);
function _FixedSizeListIterator_num(array) {
  this._html_length = array.get$length();
  _VariableSizeListIterator_num.call(this, array);
}
// ********** Code for _VariableSizeListIterator_html_Node **************
$inherits(_VariableSizeListIterator_html_Node, _VariableSizeListIterator);
function _VariableSizeListIterator_html_Node(array) {
  this._html_array = array;
  this._html_pos = (0);
}
// ********** Code for _FixedSizeListIterator_html_Node **************
$inherits(_FixedSizeListIterator_html_Node, _FixedSizeListIterator);
function _FixedSizeListIterator_html_Node(array) {
  this._html_length = array.get$length();
  _VariableSizeListIterator_html_Node.call(this, array);
}
// ********** Code for _VariableSizeListIterator_html_StyleSheet **************
$inherits(_VariableSizeListIterator_html_StyleSheet, _VariableSizeListIterator);
function _VariableSizeListIterator_html_StyleSheet(array) {
  this._html_array = array;
  this._html_pos = (0);
}
// ********** Code for _FixedSizeListIterator_html_StyleSheet **************
$inherits(_FixedSizeListIterator_html_StyleSheet, _FixedSizeListIterator);
function _FixedSizeListIterator_html_StyleSheet(array) {
  this._html_length = array.get$length();
  _VariableSizeListIterator_html_StyleSheet.call(this, array);
}
// ********** Code for _VariableSizeListIterator_html_Touch **************
$inherits(_VariableSizeListIterator_html_Touch, _VariableSizeListIterator);
function _VariableSizeListIterator_html_Touch(array) {
  this._html_array = array;
  this._html_pos = (0);
}
// ********** Code for _FixedSizeListIterator_html_Touch **************
$inherits(_FixedSizeListIterator_html_Touch, _FixedSizeListIterator);
function _FixedSizeListIterator_html_Touch(array) {
  this._html_length = array.get$length();
  _VariableSizeListIterator_html_Touch.call(this, array);
}
// ********** Code for top level **************
var _cachedWindow;
var _cachedDocument;
function _init() {
  $globals._cachedDocument = get$$_document();
  $globals._cachedWindow = get$$_window();
  var element = _ElementFactoryProvider.Element$tag$factory("body");
  element.set$innerHTML("f");
  if (element.get$text() == "") {
    $globals._cachedWindow.console.error("Cannot import dart:html and dart:dom within the same application.");
    $throw(new UnsupportedOperationException("Cannot import dart:html and dart:dom within the same application."));
  }
}
function get$$window() {
  if ($globals._cachedWindow == null) {
    _init();
  }
  return $globals._cachedWindow;
}
function get$$_window() {
  return window;
}
function get$$document() {
  if ($globals._cachedDocument == null) {
    _init();
  }
  return $globals._cachedDocument;
}
function get$$_document() {
  return window.document.documentElement;
}
var _cachedBrowserPrefix;
var _pendingRequests;
var _pendingMeasurementFrameCallbacks;
function _maybeScheduleMeasurementFrame() {
  if ($globals._nextMeasurementFrameScheduled) return;
  $globals._nextMeasurementFrameScheduled = true;
  if ($globals._firstMeasurementRequest) {
    get$$window().get$on().get$message().add((function (e) {
      return _completeMeasurementFutures();
    })
    , false);
    $globals._firstMeasurementRequest = false;
  }
  get$$window().postMessage("DART-MEASURE", "*");
}
function _createMeasurementFuture(computeValue, completer) {
  if (null == $globals._pendingRequests) {
    $globals._pendingRequests = [];
    _maybeScheduleMeasurementFrame();
  }
  $globals._pendingRequests.add(new _MeasurementRequest(computeValue, completer));
  return completer.get$future();
}
function _completeMeasurementFutures() {
  if ($eq$($globals._nextMeasurementFrameScheduled, false)) {
    return;
  }
  $globals._nextMeasurementFrameScheduled = false;
  if (null != $globals._pendingRequests) {
    var $$list = $globals._pendingRequests;
    for (var $$i = $$list.iterator(); $$i.hasNext(); ) {
      var request = $$i.next();
      try {
        request.value = request.computeValue();
      } catch (e) {
        e = _toDartException(e);
        request.value = e;
        request.exception = true;
      }
    }
  }
  var completedRequests = $globals._pendingRequests;
  var readyMeasurementFrameCallbacks = $globals._pendingMeasurementFrameCallbacks;
  $globals._pendingRequests = null;
  $globals._pendingMeasurementFrameCallbacks = null;
  if (null != completedRequests) {
    for (var $$i = completedRequests.iterator(); $$i.hasNext(); ) {
      var request = $$i.next();
      if (request.exception) {
        request.completer.completeException(request.value);
      }
      else {
        request.completer.complete(request.value);
      }
    }
  }
  if (null != readyMeasurementFrameCallbacks) {
    for (var $$i = readyMeasurementFrameCallbacks.iterator(); $$i.hasNext(); ) {
      var handler = $$i.next();
      handler();
    }
  }
}
//  ********** Library dartMultiTouchCanvas **************
// ********** Code for Line **************
function Line(x, y, color) {
  this.x = x;
  this.y = y;
  this.color = color;
}
Line.prototype.get$x = function() { return this.x; };
Line.prototype.set$x = function(value) { return this.x = value; };
Line.prototype.get$y = function() { return this.y; };
Line.prototype.set$y = function(value) { return this.y = value; };
Line.prototype.get$color = function() { return this.color; };
// ********** Code for dartMultiTouchCanvas **************
function dartMultiTouchCanvas() {
  this.colors = const$0003;
}
dartMultiTouchCanvas.prototype.run = function() {
  var canvas = get$$document().query("#canvas");
  this.context = canvas.getContext("2d");
  get$$document().query("#div").get$rect().then((function (r) {
    canvas.width = r.scroll.width;
    canvas.height = r.scroll.height;
  })
  );
  this.context.lineWidth = (Math.random() * (35)).ceil();
  this.context.lineCap = "round";
  this.lines = new HashMapImplementation();
  canvas.get$on().get$touchStart().add(this.get$preDraw(), false);
  canvas.get$on().get$touchMove().add(this.get$draw(), false);
}
dartMultiTouchCanvas.prototype.preDraw = function(event) {
  var $this = this; // closure support
  event.touches.forEach((function (t) {
    var id = t.identifier;
    var mycolor = $this.colors.$index((Math.random() * $this.colors.get$length()).floor().toInt());
    $this.lines.$setindex(id, new Line(t.pageX, t.pageY, mycolor));
  })
  );
  event.preventDefault();
}
dartMultiTouchCanvas.prototype.get$preDraw = function() {
  return this.preDraw.bind(this);
}
Function.prototype.bind = Function.prototype.bind ||
  function(thisObj) {
    var func = this;
    var funcLength = func.$length || func.length;
    var argsLength = arguments.length;
    if (argsLength > 1) {
      var boundArgs = Array.prototype.slice.call(arguments, 1);
      var bound = function() {
        // Prepend the bound arguments to the current arguments.
        var newArgs = Array.prototype.slice.call(arguments);
        Array.prototype.unshift.apply(newArgs, boundArgs);
        return func.apply(thisObj, newArgs);
      };
      bound.$length = Math.max(0, funcLength - (argsLength - 1));
      return bound;
    } else {
      var bound = function() {
        return func.apply(thisObj, arguments);
      };
      bound.$length = funcLength;
      return bound;
    }
  };
dartMultiTouchCanvas.prototype.draw = function(event) {
  var $this = this; // closure support
  event.touches.forEach((function (t) {
    var id = t.identifier;
    var moveX = $sub$(t.pageX, $this.lines.$index(id).get$x());
    var moveY = $sub$(t.pageY, $this.lines.$index(id).get$y());
    $this.move($this.lines.$index(id), moveX, moveY);
    $this.lines.$index(id).set$x($add$($this.lines.$index(id).get$x(), moveX));
    $this.lines.$index(id).set$y($add$($this.lines.$index(id).get$y(), moveY));
  })
  );
  event.preventDefault();
}
dartMultiTouchCanvas.prototype.get$draw = function() {
  return this.draw.bind(this);
}
dartMultiTouchCanvas.prototype.move = function(line, changeX, changeY) {
  this.context.strokeStyle = line.get$color();
  this.context.beginPath();
  this.context.moveTo(line.get$x(), line.get$y());
  this.context.lineTo($add$(line.get$x(), changeX), $add$(line.get$y(), changeY));
  this.context.stroke();
  this.context.closePath();
}
// ********** Code for top level **************
function main() {
  new dartMultiTouchCanvas().run();
}
// 93 dynamic types.
// 228 types
// 17 !leaf
function $dynamicSetMetadata(inputTable) {
  // TODO: Deal with light isolates.
  var table = [];
  for (var i = 0; i < inputTable.length; i++) {
    var tag = inputTable[i][0];
    var tags = inputTable[i][1];
    var map = {};
    var tagNames = tags.split('|');
    for (var j = 0; j < tagNames.length; j++) {
      map[tagNames[j]] = true;
    }
    table.push({tag: tag, tags: tags, map: map});
  }
  $dynamicMetadata = table;
}
(function(){
  var v0/*HTMLHtmlElement*/ = 'HTMLHtmlElement|SVGDocument';
  var v1/*SVGTextPositioningElement*/ = 'SVGTextPositioningElement|SVGAltGlyphElement|SVGTRefElement|SVGTSpanElement|SVGTextElement';
  var v2/*Element*/ = [v0/*HTMLHtmlElement*/,v1/*SVGTextPositioningElement*/,'Element|HTMLElement|HTMLAnchorElement|HTMLAppletElement|HTMLAreaElement|HTMLBRElement|HTMLBaseElement|HTMLBaseFontElement|HTMLBodyElement|HTMLButtonElement|HTMLCanvasElement|HTMLContentElement|HTMLDListElement|HTMLDetailsElement|HTMLDirectoryElement|HTMLDivElement|HTMLEmbedElement|HTMLFieldSetElement|HTMLFontElement|HTMLFormElement|HTMLFrameElement|HTMLFrameSetElement|HTMLHRElement|HTMLHeadElement|HTMLHeadingElement|IntentionallyInvalid|HTMLIFrameElement|HTMLImageElement|HTMLInputElement|HTMLKeygenElement|HTMLLIElement|HTMLLabelElement|HTMLLegendElement|HTMLLinkElement|HTMLMapElement|HTMLMarqueeElement|HTMLMediaElement|HTMLAudioElement|HTMLVideoElement|HTMLMenuElement|HTMLMetaElement|HTMLMeterElement|HTMLModElement|HTMLOListElement|HTMLObjectElement|HTMLOptGroupElement|HTMLOptionElement|HTMLOutputElement|HTMLParagraphElement|HTMLParamElement|HTMLPreElement|HTMLProgressElement|HTMLQuoteElement|SVGElement|SVGAElement|SVGAltGlyphDefElement|SVGAltGlyphItemElement|SVGAnimationElement|SVGAnimateColorElement|SVGAnimateElement|SVGAnimateMotionElement|SVGAnimateTransformElement|SVGSetElement|SVGCircleElement|SVGClipPathElement|SVGComponentTransferFunctionElement|SVGFEFuncAElement|SVGFEFuncBElement|SVGFEFuncGElement|SVGFEFuncRElement|SVGCursorElement|SVGDefsElement|SVGDescElement|SVGEllipseElement|SVGFEBlendElement|SVGFEColorMatrixElement|SVGFEComponentTransferElement|SVGFECompositeElement|SVGFEConvolveMatrixElement|SVGFEDiffuseLightingElement|SVGFEDisplacementMapElement|SVGFEDistantLightElement|SVGFEDropShadowElement|SVGFEFloodElement|SVGFEGaussianBlurElement|SVGFEImageElement|SVGFEMergeElement|SVGFEMergeNodeElement|SVGFEMorphologyElement|SVGFEOffsetElement|SVGFEPointLightElement|SVGFESpecularLightingElement|SVGFESpotLightElement|SVGFETileElement|SVGFETurbulenceElement|SVGFilterElement|SVGFontElement|SVGFontFaceElement|SVGFontFaceFormatElement|SVGFontFaceNameElement|SVGFontFaceSrcElement|SVGFontFaceUriElement|SVGForeignObjectElement|SVGGElement|SVGGlyphElement|SVGGlyphRefElement|SVGGradientElement|SVGLinearGradientElement|SVGRadialGradientElement|SVGHKernElement|SVGImageElement|SVGLineElement|SVGMPathElement|SVGMarkerElement|SVGMaskElement|SVGMetadataElement|SVGMissingGlyphElement|SVGPathElement|SVGPatternElement|SVGPolygonElement|SVGPolylineElement|SVGRectElement|SVGSVGElement|SVGScriptElement|SVGStopElement|SVGStyleElement|SVGSwitchElement|SVGSymbolElement|SVGTextContentElement|SVGTextPathElement|SVGTitleElement|SVGUseElement|SVGVKernElement|SVGViewElement|HTMLScriptElement|HTMLSelectElement|HTMLShadowElement|HTMLSourceElement|HTMLSpanElement|HTMLStyleElement|HTMLTableCaptionElement|HTMLTableCellElement|HTMLTableColElement|HTMLTableElement|HTMLTableRowElement|HTMLTableSectionElement|HTMLTextAreaElement|HTMLTitleElement|HTMLTrackElement|HTMLUListElement|HTMLUnknownElement'].join('|');
  var v3/*AbstractWorker*/ = 'AbstractWorker|SharedWorker|Worker';
  var v4/*Node*/ = [v2/*Element*/,'Node|Attr|CharacterData|Comment|Text|CDATASection|HTMLDocument|DocumentFragment|ShadowRoot|DocumentType|Entity|EntityReference|Notation|ProcessingInstruction'].join('|');
  var table = [
    // [dynamic-dispatch-tag, tags of classes implementing dynamic-dispatch-tag]
    ['AbstractWorker', v3/*AbstractWorker*/]
    , ['HTMLHtmlElement', v0/*HTMLHtmlElement*/]
    , ['SVGTextPositioningElement', v1/*SVGTextPositioningElement*/]
    , ['Element', v2/*Element*/]
    , ['Node', v4/*Node*/]
    , ['EventTarget', [v3/*AbstractWorker*/,v4/*Node*/,'EventTarget|DOMApplicationCache|EventSource|MessagePort|Notification|SVGElementInstance|WebSocket|DOMWindow|XMLHttpRequest|XMLHttpRequestUpload'].join('|')]
    , ['HTMLCollection', 'HTMLCollection|HTMLOptionsCollection']
    , ['Uint8Array', 'Uint8Array|Uint8ClampedArray']
  ];
  $dynamicSetMetadata(table);
})();
//  ********** Globals **************
function $static_init(){
  $globals._firstMeasurementRequest = true;
  $globals._nextMeasurementFrameScheduled = false;
}
var const$0000 = Object.create(_DeletedKeySentinel.prototype, {});
var const$0001 = Object.create(NoMoreElementsException.prototype, {});
var const$0002 = Object.create(IllegalAccessException.prototype, {});
var const$0003 = ImmutableList.ImmutableList$from$factory(["red", "green", "yellow", "blue", "magenta", "orangered"]);
var $globals = {};
$static_init();
main();
