let type = require('./type');

let f = type.overload(
    [{0: Number, 1: 'number'}, (a, b) => a + b],
    [['string'], s => 'hello ' + s]
);
console.log(f(1, 2), f('asdf'));