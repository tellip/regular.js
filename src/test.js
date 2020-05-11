const text = require('./text');

let r = text.Record(false, 0, 1, [
    ['asdf', text.Record(true, 0, 1, [])]
]);
console.log(r);