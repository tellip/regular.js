const type = require('./type');

let Record = type.function(
    {0: 'boolean', 1: 'number', 2: 'number', 3: [{0: 'string'}]},
    (success, begin, end, children) => do {
        let record = {success, begin, end, children: children.map(([key, value]) => ({key, value}))};
        record.__proto__ = Record.prototype;
        record;
    }
);
Record.rule[0][3][0][1] = Record;

let record = Record(false, 0, 1, [
    ['asdf', Record(true, 0, 1, [])]
]);
console.log(record);