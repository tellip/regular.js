let check = require('./check');

let f = check.overload(
    [['number'], (a, b) => a + b],
    [['string'], s => 'hello ' + s]
);
console.log(f(1, 2), f('asdf'));